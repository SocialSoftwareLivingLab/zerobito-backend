import CasoEntity from '@/app/casos/entities/caso.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'atas_reuniao' })
export default class AtaReuniaoEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'identificador', type: 'uuid' })
  identificador: string;

  @Column({ name: 'conteudo', nullable: true})
  conteudo: string;

  @ManyToOne(() => CasoEntity)
  @JoinColumn({ name: 'id_caso' })
  caso: CasoEntity;


  @CreateDateColumn({ name: 'data_criacao' })
  data: Date;

}
