export interface StorageService {
  upload(
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<{ key: string; url: string }>;

  download(key: string): Promise<Buffer>;

  delete(key: string): Promise<void>;
}