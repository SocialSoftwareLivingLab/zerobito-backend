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

  @Column({ name: 'instituicao', nullable: true})
  instituicao: string;

  @ManyToOne(() => CasoEntity)
  caso: CasoEntity;

  @ManyToOne(() => UsuarioEntity)
  membro: UsuarioEntity;

  //TODO: verificar se está sendo utilizado na aplicação.
  @ManyToOne(() => UsuarioEntity)
  criador: UsuarioEntity;

  @ManyToOne(() => StatusMembroGrupoTrabalhoEntity)
  status: StatusMembroGrupoTrabalhoEntity;

  @CreateDateColumn({ name: 'data_criacao' })
  dataVinculo: Date;

  @DeleteDateColumn({ name: 'data_remocao' })
  dataRemocao?: Date;
}
