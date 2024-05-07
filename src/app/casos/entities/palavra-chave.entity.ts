import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import CasoEntity from './caso.entity';

@Entity({ name: 'caso_palavra_chave' })
export default class PalavraChaveEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'valor', type: 'varchar', length: 255 })
  valor: string;

  @ManyToOne(() => CasoEntity, (caso) => caso.palavrasChave)
  caso: Relation<CasoEntity>;
}
