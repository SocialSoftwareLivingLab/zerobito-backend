import CasoEntity from '@/app/casos/entities/caso.entity';
import { UsuarioEntity } from '@/app/usuarios/usuarios.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import StatusMembroGrupoTrabalhoEntity from './status-membro.entity';

@Entity('caso_membros_grupo_trabalho')
export default class MembroGrupoTrabalhoEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'identificador', type: 'uuid' })
  identificador: string;

  @ManyToOne(() => CasoEntity)
  caso: CasoEntity;

  @ManyToOne(() => UsuarioEntity)
  membro: UsuarioEntity;

  @ManyToOne(() => UsuarioEntity)
  criador: UsuarioEntity;

  @ManyToOne(() => StatusMembroGrupoTrabalhoEntity)
  status: StatusMembroGrupoTrabalhoEntity;

  @CreateDateColumn({ name: 'data_criacao' })
  dataVinculo: Date;

  @DeleteDateColumn({ name: 'data_remocao' })
  dataRemocao?: Date;
}
