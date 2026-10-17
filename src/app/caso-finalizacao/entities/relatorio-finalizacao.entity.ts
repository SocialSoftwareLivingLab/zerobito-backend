import CasoEntity from '@/app/casos/entities/caso.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { StatusRelatorioFinalizacaoEnum } from '../enum/status-relatorio-finalizacao.enum';
import AtorRelatorioFinalizacaoEntity from './ator-relatorio-finalizacao.entity';

@Entity({ name: 'caso_relatorio_finalizacao' })
export default class RelatorioFinalizacaoEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({
    type: 'enum',
    enum: StatusRelatorioFinalizacaoEnum,
    name: 'status',
    default: StatusRelatorioFinalizacaoEnum.RASCUNHO,
  })
  status: StatusRelatorioFinalizacaoEnum;

  @OneToOne(() => CasoEntity)
  @JoinColumn()
  caso: Relation<CasoEntity>;

  @OneToMany(() => AtorRelatorioFinalizacaoEntity, (ator) => ator.relatorio, {
    cascade: true,
  })
  atores: Relation<AtorRelatorioFinalizacaoEntity[]>;
}
