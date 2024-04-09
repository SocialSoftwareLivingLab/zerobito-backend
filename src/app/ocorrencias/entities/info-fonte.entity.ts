import { Column } from 'typeorm';

export enum TipoFonte {
  ANONIMA = 'ANONIMA',
  VITIMA = 'VITIMA',
  FAMILIAR = 'FAMILIAR',
  COLEGA_TRABALHO = 'COLEGA_TRABALHO',
  SINDICATO = 'SINDICATO',
  IMPRENSA = 'IMPRENSA',
  SERVICO_SAUDE = 'SERVICO_SAUDE',
  OUTRO = 'OUTRO',
}

export class InformacoesFonte {
  @Column({ name: 'info_fonte_tipo', type: 'enum', enum: TipoFonte })
  tipo: TipoFonte;

  @Column({ name: 'info_fonte_tipo_outro', nullable: true })
  outroTipo: string;

  @Column({ name: 'info_fonte_detalhe', nullable: true })
  detalhe: string;
}
