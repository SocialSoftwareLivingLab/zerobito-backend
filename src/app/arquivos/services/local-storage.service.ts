import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { StorageService } from '../interfaces/storage.interface';

/**
 * Implementação de armazenamento local em disco.
 *
 * Para migrar para nuvem, substitua esta classe inteira por uma nova
 * implementação de StorageService (ex.: S3StorageService) e troque o
 * registro em ArquivoModule — nenhum outro arquivo precisa mudar.
 *
 * Os imports de 'fs' e 'path' abaixo não são necessários na versão em nuvem;
 * substitua pelo SDK do provedor escolhido (ex.: @aws-sdk/client-s3).
 */
@Injectable()
export class LocalStorageService implements StorageService {
  // Para nuvem: remova esta propriedade e configure bucket/container via variável de ambiente.
  private readonly uploadPath = join(process.cwd(), 'storage');

  async upload(buffer: Buffer, fileName: string) {
    const key = `${randomUUID()}-${fileName}`;
    const filePath = join(this.uploadPath, key);

    // Para nuvem: substitua por s3.send(new PutObjectCommand({ Bucket, Key: key, Body: buffer })).
    // A `url` retornada deve ser a URL pública do CDN ou uma pre-signed URL do bucket.
    await fs.mkdir(this.uploadPath, { recursive: true });
    await fs.writeFile(filePath, buffer);

    return {
      key,
      url: `/arquivos/download/${key}`,
    };
  }

  async download(key: string): Promise<Buffer> {
    const filePath = join(this.uploadPath, key);
    // Para nuvem: substitua por s3.send(new GetObjectCommand({ Bucket, Key: key }))
    // e converta o Body (stream) para Buffer. Avalie se vale retornar
    // uma pre-signed URL e redirecionar o cliente direto ao bucket
    // (veja comentário no controller), evitando proxiar o arquivo pelo servidor.
    return fs.readFile(filePath);
  }

  async delete(key: string): Promise<void> {
    const filePath = join(this.uploadPath, key);
    // Para nuvem: substitua por s3.send(new DeleteObjectCommand({ Bucket, Key: key })).
    await fs.unlink(filePath);
  }
}