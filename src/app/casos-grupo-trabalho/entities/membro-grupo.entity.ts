import CasoEntity from '@/app/casos/entities/caso.entity';
import { UsuarioEntity } from '@/app/usuarios/usuarios.entity';
import { PerfilEntity } from '@/app/usuarios/entities/perfil.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import StatusMembroGrupoTrabalhoEntity from './status-membro.entity';

@Entity({ name: 'caso_grupo_trabalho_membro' })
export default class MembroGrupoTrabalhoEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'identificador', type: 'uuid' })
  identificador: string;

  @Column({ name: 'instituicao', nullable: true})
  instituicao: string;

  @ManyToOne(() => CasoEntity)
  caso: CasoEntity;

  @ManyToOne(() => UsuarioEntity)
  membro: UsuarioEntity;

  @ManyToOne(() => UsuarioEntity)
  criador: UsuarioEntity;

  @ManyToOne(() => StatusMembroGrupoTrabalhoEntity)
  status: StatusMembroGrupoTrabalhoEntity;

  @ManyToOne(() => PerfilEntity, {
    eager: true,
    nullable: true,
  })
  perfil?: PerfilEntity;

  @CreateDateColumn({ name: 'data_criacao' })
  dataVinculo: Date;

  @DeleteDateColumn({ name: 'data_remocao' })
  dataRemocao?: Date;
}
