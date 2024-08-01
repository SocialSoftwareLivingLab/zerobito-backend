import CasoEntity from '@/app/casos/entities/caso.entity';
import { UsuarioEntity } from '@/app/usuarios/usuarios.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import StatusConviteGrupoTrabalhoEntity from './status-convite-membro.entity';

@Entity({ name: 'caso_grupo_trabalho_convite' })
export default class ConviteGrupoTrabalhoEntity {
  @PrimaryGeneratedColumn('identity', { type: 'bigint' })
  id: number;

  @Column()
  identificador: string;

  @ManyToOne(() => CasoEntity)
  @JoinColumn({ name: 'id_caso' })
  caso: CasoEntity;

  @ManyToOne(() => UsuarioEntity)
  @JoinColumn({ name: 'id_usuario_criador' })
  criador: UsuarioEntity;

  @ManyToOne(() => StatusConviteGrupoTrabalhoEntity)
  @JoinColumn({ name: 'id_status' })
  status: StatusConviteGrupoTrabalhoEntity;

  @Column({ name: 'convidado_nome' })
  nomeConvidado: string;

  @Column({ name: 'convidado_email' })
  emailConvidado: string;

  @Column()
  motivo: string;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;

  @UpdateDateColumn({ name: 'data_alteracao' })
  dataAlteracao: Date;
}
