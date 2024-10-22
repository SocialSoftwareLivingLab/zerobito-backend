import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissaoEntity } from './permissao.entity';

@Entity({ name: 'perfil_membro_caso' })
export default class PerfilMembroCasoEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'nome' })
  nome: string;

  @Column({ name: 'sigla' })
  sigla: string;

  @ManyToMany(() => PermissaoEntity)
  @JoinTable({
    name: 'perfil_membro_caso_permissao',
    joinColumn: {
      name: 'id_perfil_membro_caso',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'id_permissao',
      referencedColumnName: 'id',
    },
  })
  permissoes: PermissaoEntity[];
}
