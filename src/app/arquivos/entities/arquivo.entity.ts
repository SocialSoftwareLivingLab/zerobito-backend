import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'arquivo' })
export class ArquivoEntity {

  // 🔹 ID público do arquivo (usado no banco e API)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 🔹 Nome original enviado pelo usuário
  @Column({ name: 'filename', type: 'varchar', length: 255 })
  filename: string;

  // 🔹 Tipo MIME (ex: application/pdf, image/png)
  @Column({ name: 'mime_type', type: 'varchar', length: 100 })
  mimeType: string;

  // 🔹 Tamanho em bytes
  @Column({ name: 'size', type: 'int' })
  size: number;

  // 🔹 Identificador retornado pelo FileStorage
  // NÃO é caminho, NÃO é URL
  @Index()
  @Column({ name: 'storage_id', type: 'varchar', length: 255 })
  storageId: string;

  // 🔹 Namespace (casos, usuarios, relatorios...)
  @Column({ name: 'namespace', type: 'varchar', length: 100 })
  namespace: string;

  // 🔹 Data de upload
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

}
