import { UsuarioEntity } from '@/app/usuarios/usuarios.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import AtorRelatorioFinalizacaoEntity from './ator-relatorio-finalizacao.entity';

@Entity({ name: 'caso_relatorio_finalizacao_comentarios' })
@Unique(['ator', 'autor'])
export default class ComentarioAtorRelatorioEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'text', name: 'texto' })
  texto: string;

  @ManyToOne(() => AtorRelatorioFinalizacaoEntity, { onDelete: 'CASCADE' })
  ator: Relation<AtorRelatorioFinalizacaoEntity>;

  @ManyToOne(() => UsuarioEntity)
  autor: Relation<UsuarioEntity>;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;

  @UpdateDateColumn({ name: 'data_atualizacao' })
  dataAtualizacao: Date;
}
