import { Column } from 'typeorm';

export class InformacoesEmpresa {
  @Column({ name: 'info_empresa_nome' })
  nome: string;

  @Column({ name: 'info_empresa_cnpj' })
  cnpj: string;
}
