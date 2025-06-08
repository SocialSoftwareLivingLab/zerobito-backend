import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PerfilEntity } from './perfil.entity';

@Entity({ name: 'permissao' })
export class PermissaoEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  codigo: string;

  @Column()
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @ManyToMany(() => PerfilEntity, (perfil) => perfil.permissoes)
  perfis: PerfilEntity[];

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;

  @UpdateDateColumn({ name: 'data_alteracao' })
  dataAlteracao: Date;
}
