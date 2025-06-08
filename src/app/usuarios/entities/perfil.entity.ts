import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PermissaoEntity } from './permissao.entity';

@Entity({ name: 'perfil' })
export class PerfilEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  codigo: string;

  @Column({ name: 'is_perfil_caso', type: 'boolean', default: false })
  isPerfilCaso: boolean;

  @Column()
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @ManyToMany(() => PermissaoEntity, (permissao) => permissao.perfis)
  @JoinTable({
    name: 'perfil_permissao',
    joinColumn: { name: 'id_perfil', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'id_permissao', referencedColumnName: 'id' },
  })
  permissoes: PermissaoEntity[];

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;

  @UpdateDateColumn({ name: 'data_alteracao' })
  dataAlteracao: Date;
}
