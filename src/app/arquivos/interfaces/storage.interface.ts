/**
 * Contrato de armazenamento de arquivos.
 *
 * Para migrar para armazenamento em nuvem (S3, GCS, Azure Blob, etc.),
 * crie uma nova classe que implemente esta interface e registre-a em
 * ArquivoModule (veja o comentário em arquivo.module.ts).
 *
 * Pontos de atenção ao implementar para nuvem:
 *   - upload:   o `key` retornado deve ser o identificador do objeto no bucket
 *               (ex.: o object key do S3). A `url` pode ser a URL pública do
 *               CDN ou uma pre-signed URL gerada no momento do upload.
 *   - download: para arquivos grandes, considere retornar uma Readable stream
 *               em vez de um Buffer para evitar carregar o arquivo inteiro em
 *               memória no servidor — isso exigirá ajuste em ArquivoService e
 *               no controller (veja comentários nesses arquivos).
 *   - delete:   equivale a s3.deleteObject / storage.delete — sem alterações
 *               na assinatura.
 */
export interface StorageService {
  upload(
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<{ key: string; url: string }>;

  download(key: string): Promise<Buffer>;

  delete(key: string): Promise<void>;
}