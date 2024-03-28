import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ocorrencia_status' })
export class StatusOcorrenciaEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  sigla: string;

  @Column()
  descricao: string;
}
