import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  JoinColumn
} from 'typeorm';
import { ArquivoEntity } from './arquivo.entity';

@Entity({ name: 'arquivo_vinculo' })
@Index(['entityType', 'entityId'])
export class ArquivoVinculoEntity {

  @PrimaryGeneratedColumn()
  id: number;

  // 🔹 Qual entidade está vinculando
  @Column({ name: 'entity_type', length: 100 })
  entityType: string;

  // 🔹 ID da entidade vinculada
  @Column({ name: 'entity_id' })
  entityId: string;

  // 🔹 Arquivo vinculado
  @Column({ name: 'arquivo_id' })
  arquivoId: string;

  @ManyToOne(() => ArquivoEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'arquivo_id' })
  arquivo: ArquivoEntity;
}
