import { watch, FSWatcher } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { EventEmitter } from 'node:events';

export interface TeledriveFileEvent {
  type: 'add' | 'change' | 'unlink';
  filePath: string;
  fileName: string;
  relativePath: string;
  timestamp: Date;
  size?: number;
}

export interface TeledriveWatcherConfig {
  uploadPath: string;
  watchSubdirs?: string[];
  debounceMs?: number;
  onError?: (error: Error) => void;
}

export class TeledriveWatcher extends EventEmitter {
  private watcher: FSWatcher | null = null;
  private config: TeledriveWatcherConfig;
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private isWatching = false;
  private processedFiles: Set<string> = new Set();

  constructor(config: TeledriveWatcherConfig) {
    super();
    this.config = {
      watchSubdirs: ['documents', 'photos', 'videos', 'passports'],
      debounceMs: 500,
      ...config
    };
  }

  getUploadPath(): string {
    return this.config.uploadPath;
  }

  async start(): Promise<void> {
    if (this.isWatching) {
      console.log('[TeledriveWatcher] Already watching');
      return;
    }

    const uploadPath = this.config.uploadPath;
    console.log(`[TeledriveWatcher] Starting file system watcher on: ${uploadPath}`);

    try {
      await this.scanExistingFiles(uploadPath);

      this.watcher = watch(uploadPath, { recursive: true }, (eventType, filename) => {
        if (!filename) return;
        this.handleFileEvent(eventType, filename);
      });

      this.watcher.on('error', (error) => {
        console.error('[TeledriveWatcher] Watcher error:', error);
        this.config.onError?.(error);
        this.emit('error', error);
      });

      this.isWatching = true;
      console.log('[TeledriveWatcher] File system watcher started successfully');
      this.emit('started');
    } catch (error) {
      console.error('[TeledriveWatcher] Failed to start watcher:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
    
    this.debounceTimers.forEach((timer) => clearTimeout(timer));
    this.debounceTimers.clear();
    this.isWatching = false;
    
    console.log('[TeledriveWatcher] File system watcher stopped');
    this.emit('stopped');
  }

  private async scanExistingFiles(uploadPath: string): Promise<void> {
    try {
      const entries = await readdir(uploadPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isFile()) {
          this.processedFiles.add(entry.name);
        } else if (entry.isDirectory()) {
          const subDirPath = path.join(uploadPath, entry.name);
          await this.scanDirectory(subDirPath, entry.name);
        }
      }
      
      console.log(`[TeledriveWatcher] Found ${this.processedFiles.size} existing files`);
    } catch (error) {
      console.error('[TeledriveWatcher] Error scanning existing files:', error);
    }
  }

  private async scanDirectory(dirPath: string, prefix: string): Promise<void> {
    try {
      const entries = await readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isFile()) {
          this.processedFiles.add(`${prefix}/${entry.name}`);
        } else if (entry.isDirectory()) {
          await this.scanDirectory(path.join(dirPath, entry.name), `${prefix}/${entry.name}`);
        }
      }
    } catch (error) {
      console.error(`[TeledriveWatcher] Error scanning directory ${dirPath}:`, error);
    }
  }

  private handleFileEvent(eventType: string, filename: string): void {
    const fullPath = path.join(this.config.uploadPath, filename);
    const key = `${eventType}:${filename}`;
    
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key)!);
    }

    const timer = setTimeout(async () => {
      this.debounceTimers.delete(key);
      
      try {
        const stats = await stat(fullPath).catch(() => null);
        
        if (eventType === 'rename') {
          if (stats?.isFile()) {
            await this.handleFileAdd(filename, stats);
          } else {
            await this.handleFileUnlink(filename);
          }
        } else if (eventType === 'change') {
          await this.handleFileChange(filename, stats ?? undefined);
        }
      } catch (error) {
        console.error(`[TeledriveWatcher] Error handling file event for ${filename}:`, error);
      }
    }, this.config.debounceMs);

    this.debounceTimers.set(key, timer);
  }

  private async handleFileAdd(filename: string, stats?: Awaited<ReturnType<typeof stat>>): Promise<void> {
    const relativePath = path.relative(this.config.uploadPath, path.join(this.config.uploadPath, filename));
    const fileName = path.basename(filename);
    
    if (this.processedFiles.has(fileName) || this.processedFiles.has(relativePath)) {
      console.log(`[TeledriveWatcher] File already processed: ${filename}`);
      return;
    }

    this.processedFiles.add(relativePath);

    const event: TeledriveFileEvent = {
      type: 'add',
      filePath: path.join(this.config.uploadPath, filename),
      fileName,
      relativePath,
      timestamp: new Date(),
      size: stats?.size ? Number(stats.size) : undefined
    };

    console.log(`[TeledriveWatcher] New file detected: ${filename} (${stats?.size || 'unknown'} bytes)`);
    
    this.emit('file:add', event);
    this.emit('sync:pending', event);
  }

  private async handleFileChange(filename: string, stats?: Awaited<ReturnType<typeof stat>>): Promise<void> {
    const relativePath = path.relative(this.config.uploadPath, path.join(this.config.uploadPath, filename));
    const fileName = path.basename(filename);

    const event: TeledriveFileEvent = {
      type: 'change',
      filePath: path.join(this.config.uploadPath, filename),
      fileName,
      relativePath,
      timestamp: new Date(),
      size: stats?.size ? Number(stats.size) : undefined
    };

    console.log(`[TeledriveWatcher] File changed: ${filename} (${stats?.size ? Number(stats.size) : 'unknown'} bytes)`);
    this.emit('file:change', event);
  }

  private async handleFileUnlink(filename: string): Promise<void> {
    const relativePath = path.relative(this.config.uploadPath, path.join(this.config.uploadPath, filename));
    const fileName = path.basename(filename);

    this.processedFiles.delete(relativePath);

    const event: TeledriveFileEvent = {
      type: 'unlink',
      filePath: path.join(this.config.uploadPath, filename),
      fileName,
      relativePath,
      timestamp: new Date()
    };

    console.log(`[TeledriveWatcher] File removed: ${filename}`);
    this.emit('file:unlink', event);
  }

  getStatus(): { isWatching: boolean; processedFiles: number } {
    return {
      isWatching: this.isWatching,
      processedFiles: this.processedFiles.size
    };
  }

  getWatchedFiles(): string[] {
    return Array.from(this.processedFiles);
  }
}

let watcherInstance: TeledriveWatcher | null = null;

export function getTeledriveWatcher(): TeledriveWatcher | null {
  return watcherInstance;
}

export async function initTeledriveWatcher(): Promise<TeledriveWatcher> {
  const uploadPath = process.env.UPLOAD_PATH;
  
  if (!uploadPath) {
    throw new Error('UPLOAD_PATH environment variable is not set');
  }

  const watcher = new TeledriveWatcher({
    uploadPath,
    debounceMs: 500,
    onError: (error) => {
      console.error('[TeledriveWatcher] Configuration error:', error.message);
    }
  });

  watcherInstance = watcher;
  
  await watcher.start();
  
  return watcher;
}

export async function stopTeledriveWatcher(): Promise<void> {
  if (watcherInstance) {
    await watcherInstance.stop();
    watcherInstance = null;
  }
}

if (require.main === module) {
  console.log('[TeledriveWatcher] Running as standalone process...');
  
  const uploadPath = process.env.UPLOAD_PATH;
  
  if (!uploadPath) {
    console.error('Error: UPLOAD_PATH environment variable is required');
    process.exit(1);
  }

  const watcher = new TeledriveWatcher({
    uploadPath,
    debounceMs: 500
  });

  watcher.on('file:add', (event) => {
    console.log(`[TeledriveWatcher] 📁 File added: ${event.relativePath} (${event.size} bytes)`);
  });

  watcher.on('file:change', (event) => {
    console.log(`[TeledriveWatcher] ✏️ File changed: ${event.relativePath}`);
  });

  watcher.on('file:unlink', (event) => {
    console.log(`[TeledriveWatcher] 🗑️ File removed: ${event.relativePath}`);
  });

  watcher.on('error', (error) => {
    console.error('[TeledriveWatcher] Error:', error);
  });

  process.on('SIGINT', async () => {
    console.log('\n[TeledriveWatcher] Shutting down...');
    await watcher.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n[TeledriveWatcher] Shutting down...');
    await watcher.stop();
    process.exit(0);
  });

  watcher.start().catch((error) => {
    console.error('Failed to start watcher:', error);
    process.exit(1);
  });
}