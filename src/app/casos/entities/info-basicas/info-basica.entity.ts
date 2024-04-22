import { Column, JoinColumn, ManyToOne } from 'typeorm';
import CausaEntity from './causa.entity';
import DiagnosticoEntity from './diagnostico.entity';

export default class InformacoesBasicas {
  @ManyToOne(() => CausaEntity, { nullable: true })
  @JoinColumn({ name: 'id_causa_primaria' })
  causaPrimaria: CausaEntity;

  @ManyToOne(() => CausaEntity, { nullable: true })
  @JoinColumn({ name: 'id_causa_secundaria' })
  causaSecundaria: CausaEntity;

  @ManyToOne(() => DiagnosticoEntity, { nullable: true })
  @JoinColumn({ name: 'id_diagnostico' })
  diagnostico: DiagnosticoEntity;

  @Column({ name: 'comentario', type: 'text', nullable: true })
  comentario: string;
}
