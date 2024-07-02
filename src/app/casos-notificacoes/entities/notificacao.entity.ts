import CasoEntity from '@/app/casos/entities/caso.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import TipoNotificacaoEntity from './notificacao-tipo.entity';
import { UsuarioEntity } from '@/app/usuarios/usuarios.entity';

@Entity({ name: 'caso_notificacao' })
export default class NotificacaoCasoEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ManyToOne(() => CasoEntity, { nullable: false })
  caso: CasoEntity;

  @Column({ name: 'data_emissao', nullable: true })
  dataEmissao: Date;

  @Column({ name: 'is_emitida' })
  isEmitida: boolean;

  @Column({ name: 'status_notificacao', nullable: true})
  statusNotificacao: string;

  @Column({ name: 'identificador', type: 'varchar', length: 255 })
  identificador: string;

  @ManyToOne(() => TipoNotificacaoEntity, { nullable: false })
  tipo: TipoNotificacaoEntity;

  @Column({ name: 'observacao', type: 'text' })
  observacao: string;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;

  @ManyToOne(() => UsuarioEntity, { nullable: false })
  @JoinColumn({ name: 'id_usuario_criador' })
  criador: UsuarioEntity;
}
