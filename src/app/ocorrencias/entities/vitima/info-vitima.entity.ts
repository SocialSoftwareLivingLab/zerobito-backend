import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { CondicaoVitimaEntity } from './condicao-vitima.entity';

export class InformacoesVitima {
  @Column({ name: 'info_vitima_nome' })
  nome: string;

  @Column({ name: 'info_vitima_empresa_vinculo' })
  vinculo: string;

  @JoinColumn({ name: 'id_info_vitima_condicao' })
  @ManyToOne(() => CondicaoVitimaEntity, { eager: true })
  condicao: CondicaoVitimaEntity;
}
