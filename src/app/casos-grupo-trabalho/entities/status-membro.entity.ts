import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'caso_grupo_trabalho_membro_status' })
export default class StatusMembroGrupoTrabalhoEntity {
  @PrimaryGeneratedColumn('identity', { type: 'bigint' })
  id: number;

  @Column()
  codigo: string;

  @Column()
  nome: string;

  @Column()
  descricao: string;
}
