import CasoEntity from '@/app/casos/entities/caso.entity';
import {
    Check,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import MembroGrupoTrabalhoEntity from '@/app/casos-grupo-trabalho/entities/membro-grupo.entity';
import { AcoesIntervencaoStatusEnum } from '../enum/acao-intervencao-status.enum';
import { ArquivoEntity } from '@/app/arquivos/entities/arquivo.entity';

@Entity({ name: 'caso_mapa_etapa' })
@Check(`"prioridade" >= 0 AND "prioridade" <= 1`)
export default class CasoIntervencaoEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({name: 'name'})
  name: string;

  @Column({name: 'recursos'})
  recursos: string;

  @Column({ name: 'prazo' })
  prazo: Date;

  @Column({
  name: 'prioridade',
  type: 'decimal',
  default: 0.5,
  precision: 3,
  scale: 2,
  transformer: {
    to: (value: number) => value,
    from: (value: string) => parseFloat(value),
  }
})
prioridade: number;

  @Column({ type: 'enum',
              enum: AcoesIntervencaoStatusEnum,
              name: 'status',
            default: AcoesIntervencaoStatusEnum.SEM_PREVISAO})
    status: AcoesIntervencaoStatusEnum;

  @ManyToOne(() => MembroGrupoTrabalhoEntity)
  autor: MembroGrupoTrabalhoEntity;

  @ManyToOne(() => CasoEntity)
  caso: CasoEntity;


}
