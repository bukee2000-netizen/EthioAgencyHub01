import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

function getUploadPath() {
  const uploadPath = process.env.UPLOAD_PATH;
  if (!uploadPath) {
    throw new Error('UPLOAD_PATH must point to the Teledrive sync folder.');
  }
  return uploadPath;
}

export async function saveToTeledriveFolder(file: File, folder = 'documents') {
  const root = getUploadPath();
  const targetDir = path.join(root, folder);
  await mkdir(targetDir, { recursive: true });

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const fileName = `${Date.now()}-${safeName}`;
  const targetPath = path.join(targetDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(targetPath, buffer);

  return targetPath;
}
