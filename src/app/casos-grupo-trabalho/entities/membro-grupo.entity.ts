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

@Entity('caso_membros_grupo_trabalho')
export default class MembroGrupoTrabalho {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'identificador', type: 'uuid' })
  identificador: string;

  @Column({ name: 'is_coordenador' })
  coordenador: boolean;

  @ManyToOne(() => CasoEntity)
  caso: CasoEntity;

  @ManyToOne(() => UsuarioEntity)
  membro: UsuarioEntity;

  @ManyToOne(() => UsuarioEntity)
  criador: UsuarioEntity;

  @CreateDateColumn({ name: 'data_criacao' })
  dataVinculo: Date;

  @DeleteDateColumn({ name: 'data_remocao' })
  dataRemocao?: Date;
}
