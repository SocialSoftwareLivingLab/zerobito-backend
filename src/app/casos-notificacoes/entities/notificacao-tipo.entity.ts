import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'caso_notificacao_tipo' })
export default class TipoNotificacaoEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome: string;

  @Column({ name: 'descricao', type: 'text' })
  descricao: string;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;
  
}
