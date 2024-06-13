import CasoEntity from '@/app/casos/entities/caso.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import TipoNotificacaoEntity from './notificacao-tipo.entity';

@Entity({ name: 'caso_notificacao' })
export default class NotificacaoCasoEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ManyToOne(() => CasoEntity, (caso) => caso.notificacoes, { nullable: false })
  caso: CasoEntity;

  @Column({ name: 'data_emissao' })
  dataEmissao: Date;

  @Column({ name: 'identificador', type: 'varchar', length: 255 })
  identificador: string;

  @ManyToOne(() => TipoNotificacaoEntity, { nullable: false })
  tipo: TipoNotificacaoEntity;

  @Column({ name: 'observacao', type: 'text' })
  observacao: string;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;
}
