import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { AtorFinalizacaoEnum } from '../enum/ator-finalizacao.enum';
import RelatorioFinalizacaoEntity from './relatorio-finalizacao.entity';

@Entity({ name: 'caso_relatorio_finalizacao_atores' })
export default class AtorRelatorioFinalizacaoEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'enum', enum: AtorFinalizacaoEnum, name: 'ator' })
  ator: AtorFinalizacaoEnum;

  @Column({ type: 'text', name: 'descricao', default: '' })
  descricao: string;

  @ManyToOne(() => RelatorioFinalizacaoEntity, (relatorio) => relatorio.atores, {
    onDelete: 'CASCADE',
  })
  relatorio: Relation<RelatorioFinalizacaoEntity>;
}
