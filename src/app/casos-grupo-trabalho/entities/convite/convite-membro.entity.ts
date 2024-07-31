import CasoEntity from '@/app/casos/entities/caso.entity';
import { UsuarioEntity } from '@/app/usuarios/usuarios.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'caso_grupo_trabalho_convite' })
export default class ConviteGrupoTrabalhoEntity {
  @PrimaryGeneratedColumn('identity', { type: 'bigint' })
  id: number;
  identificador: string;

  @ManyToOne(() => CasoEntity)
  @JoinColumn({ name: 'id_caso' })
  caso: CasoEntity;

  @ManyToOne(() => UsuarioEntity)
  @JoinColumn({ name: 'id_usuario_criador' })
  criador: UsuarioEntity;

  nomeConvidado: string;

  @ManyToOne(() => UsuarioEntity)
  @JoinColumn({ name: 'id_usuario_membro' })
  membroVinculado: UsuarioEntity;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;

  @UpdateDateColumn({ name: 'data_alteracao' })
  dataAlteracao: Date;
}
