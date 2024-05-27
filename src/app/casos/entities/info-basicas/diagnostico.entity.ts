import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'caso_diagnostico' })
export default class DiagnosticoEntity {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ name: 'codigo', type: 'varchar', length: 150 })
  codigo: string;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome: string;

  @Column({ name: 'descricao', type: 'varchar', length: 255 })
  descricao: string;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;
}
