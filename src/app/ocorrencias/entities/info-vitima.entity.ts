import { Column } from 'typeorm';

export enum CondicaoVitimaEnum {
  OBITO = 'OBITO',
  INCIDENTE_ALTO_POTENCIAL = 'INCIDENTE_ALTO_POTENCIAL',
}

export enum GravidadeCondicaoEnum {
  EMERGENCIAL = 'EMERGENCIAL',
  MUITO_URGENTE = 'MUITO_URGENTE',
  URGENTE = 'URGENTE',
  POUCO_URGENTE = 'POUCO_URGENTE',
}

export class InformacoesVitima {
  @Column({ name: 'info_vitima_nome' })
  nome: string;

  @Column({ name: 'info_vitima_empresa_vinculo' })
  vinculo: string;

  @Column({
    name: 'info_vitima_condicao',
    type: 'enum',
    enum: CondicaoVitimaEnum,
    nullable: true,
  })
  condicao: CondicaoVitimaEnum;

  @Column({
    name: 'info_vitima_gravidade',
    type: 'enum',
    enum: GravidadeCondicaoEnum,
    nullable: true,
  })
  gravidade: GravidadeCondicaoEnum;
}
