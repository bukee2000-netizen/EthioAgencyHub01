import { TeledriveWatcher, type TeledriveFileEvent, initTeledriveWatcher, stopTeledriveWatcher } from './watcher';

interface SyncRecord {
  id: string;
  filePath: string;
  relativePath: string;
  fileName: string;
  size: number;
  status: 'pending' | 'synced' | 'error';
  createdAt: Date;
  syncedAt?: Date;
  error?: string;
}

class TeledriveSyncManager {
  private watcher: TeledriveWatcher | null = null;
  private syncRecords: Map<string, SyncRecord> = new Map();
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      this.watcher = await initTeledriveWatcher();
      
      this.watcher.on('file:add', (event) => this.handleFileAdd(event));
      this.watcher.on('file:change', (event) => this.handleFileChange(event));
      this.watcher.on('file:unlink', (event) => this.handleFileUnlink(event));
      
      this.initialized = true;
      console.log('[TeledriveSyncManager] Initialized successfully');
    } catch (error) {
      console.error('[TeledriveSyncManager] Failed to initialize:', error);
      throw error;
    }
  }

  async shutdown(): Promise<void> {
    await stopTeledriveWatcher();
    this.watcher = null;
    this.initialized = false;
  }

  private generateId(): string {
    return `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private handleFileAdd(event: TeledriveFileEvent): void {
    const record: SyncRecord = {
      id: this.generateId(),
      filePath: event.filePath,
      relativePath: event.relativePath,
      fileName: event.fileName,
      size: event.size || 0,
      status: 'pending',
      createdAt: new Date()
    };
    
    this.syncRecords.set(event.relativePath, record);
    console.log(`[TeledriveSyncManager] File queued for sync: ${event.relativePath}`);
  }

  private handleFileChange(event: TeledriveFileEvent): void {
    const existing = this.syncRecords.get(event.relativePath);
    if (existing) {
      existing.status = 'pending';
      existing.size = event.size || existing.size;
      console.log(`[TeledriveSyncManager] File re-queued for sync: ${event.relativePath}`);
    } else {
      this.handleFileAdd(event);
    }
  }

  private handleFileUnlink(event: TeledriveFileEvent): void {
    this.syncRecords.delete(event.relativePath);
    console.log(`[TeledriveSyncManager] File removed from sync queue: ${event.relativePath}`);
  }

  markAsSynced(filePath: string): void {
    const record = Array.from(this.syncRecords.values()).find(r => r.filePath === filePath || r.relativePath === filePath);
    if (record) {
      record.status = 'synced';
      record.syncedAt = new Date();
      console.log(`[TeledriveSyncManager] File marked as synced: ${record.relativePath}`);
    }
  }

  markAsError(filePath: string, error: string): void {
    const record = Array.from(this.syncRecords.values()).find(r => r.filePath === filePath || r.relativePath === filePath);
    if (record) {
      record.status = 'error';
      record.error = error;
      console.error(`[TeledriveSyncManager] File sync error: ${record.relativePath} - ${error}`);
    }
  }

  getPendingFiles(): SyncRecord[] {
    return Array.from(this.syncRecords.values()).filter(r => r.status === 'pending');
  }

  getSyncedFiles(): SyncRecord[] {
    return Array.from(this.syncRecords.values()).filter(r => r.status === 'synced');
  }

  getErrorFiles(): SyncRecord[] {
    return Array.from(this.syncRecords.values()).filter(r => r.status === 'error');
  }

  getSyncStatus(): { pending: number; synced: number; errors: number; total: number } {
    const records = Array.from(this.syncRecords.values());
    return {
      pending: records.filter(r => r.status === 'pending').length,
      synced: records.filter(r => r.status === 'synced').length,
      errors: records.filter(r => r.status === 'error').length,
      total: records.length
    };
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getWatcherStatus(): { isWatching: boolean; processedFiles: number } | null {
    if (this.watcher) {
      return this.watcher.getStatus();
    }
    return null;
  }
}

const syncManager = new TeledriveSyncManager();

export { TeledriveSyncManager, syncManager };
export type { SyncRecord };

export async function initializeTeledriveSync(): Promise<void> {
  const uploadPath = process.env.UPLOAD_PATH;
  if (!uploadPath) {
    console.warn('[TeledriveSync] UPLOAD_PATH not set - Teledrive sync disabled');
    return;
  }
  await syncManager.initialize();
}

export async function shutdownTeledriveSync(): Promise<void> {
  await syncManager.shutdown();
}

export function getSyncStatus() {
  return syncManager.getSyncStatus();
}

export function getPendingFiles() {
  return syncManager.getPendingFiles();
}

export function getSyncedFiles() {
  return syncManager.getSyncedFiles();
}