import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'caso_membro_grupo_trabalho_status'})
export default class StatusMembroGrupoTrabalho {
  @PrimaryGeneratedColumn('identity', { type: 'bigint' })
  id: number;

  @Column()
  codigo: string;

  @Column()
  nome: string;

  @Column()
  descricao: string;
}
