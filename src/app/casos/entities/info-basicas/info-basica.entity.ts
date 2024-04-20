import { Column, JoinColumn, ManyToOne } from 'typeorm';
import CausaEntity from './causa.entity';
import DiagnosticoEntity from './diagnostico.entity';

export default class InformacoesBasicas {
  @ManyToOne(() => CausaEntity)
  @JoinColumn({ name: 'id_causa_primaria' })
  causaPrimaria: CausaEntity;

  @ManyToOne(() => CausaEntity)
  @JoinColumn({ name: 'id_causa_secundaria' })
  causaSecundaria: CausaEntity;

  @ManyToOne(() => DiagnosticoEntity)
  @JoinColumn({ name: 'id_diagnostico' })
  diagnostico: DiagnosticoEntity;

  @Column({ name: 'comentario', type: 'text' })
  comentario: string;
}
