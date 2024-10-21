import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'permissao' })
export class PermissaoEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'descricao' })
  descricao: string;

  @Column({ name: 'sigla' })
  sigla: string;
}
