import CasoEntity from '@/app/casos/entities/caso.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MapaEtapaEnum } from '../enum/etapa-enum';
import { MapaEtapaStatusEnum } from '../enum/status-etapa.enum';

@Entity({ name: 'caso_mapa_etapa' })
export default class CasoMapaEtapaEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type:'enum',
            enum: MapaEtapaEnum,
            name: 'name'})
  name: MapaEtapaEnum;

  @Column({ type: 'enum',
            enum: MapaEtapaStatusEnum,
            name: 'status'})
  status: MapaEtapaStatusEnum;

  @Column({ name: 'descricao'})
  descricao: string;

  @ManyToOne(() => CasoEntity)
  caso: CasoEntity;
}
