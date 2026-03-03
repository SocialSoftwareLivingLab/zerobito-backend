import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { StorageService } from '../interfaces/storage.interface';

@Injectable()
export class LocalStorageService implements StorageService {
  private readonly uploadPath = join(process.cwd(), 'storage');

  async upload(buffer: Buffer, fileName: string) {
    const key = `${randomUUID()}-${fileName}`;
    const filePath = join(this.uploadPath, key);

    await fs.mkdir(this.uploadPath, { recursive: true });
    await fs.writeFile(filePath, buffer);

    return {
      key,
      url: `/arquivos/download/${key}`,
    };
  }

  async download(key: string): Promise<Buffer> {
    const filePath = join(this.uploadPath, key);
    return fs.readFile(filePath);
  }

  async delete(key: string): Promise<void> {
    const filePath = join(this.uploadPath, key);
    await fs.unlink(filePath);
  }
}