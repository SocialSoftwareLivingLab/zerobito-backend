import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ocorrencia_vitima_condicao' })
export class CondicaoVitimaEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  sigla: string;

  @Column()
  descricao: string;
}
