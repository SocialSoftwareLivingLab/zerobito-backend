import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissaoEntity } from './permissao.entity';

@Entity({ name: 'perfil_usuario' })
export class PerfilUsuarioEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'nome' })
  nome: string;

  @Column({ name: 'descricao' })
  descricao: string;

  @ManyToMany(() => PermissaoEntity)
  @JoinTable({
    name: 'perfil_usuario_permissao',
    joinColumn: {
      name: 'id_perfil_usuario',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'id_permissao',
      referencedColumnName: 'id',
    },
  })
  permissoes: PermissaoEntity[];
}
