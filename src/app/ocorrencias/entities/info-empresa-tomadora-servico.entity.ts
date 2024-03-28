import { Column } from 'typeorm';

export class InfoEmpresaTomadoraServico {
  @Column({ name: 'info_empresa_tomadora_servico_nome', nullable: true })
  nome: string;

  @Column({ name: 'info_empresa_tomadora_servico_cnpj', nullable: true })
  cnpj: string;
}
