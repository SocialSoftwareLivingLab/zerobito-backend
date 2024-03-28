import { Column } from 'typeorm';
import { InfoEmpresaTomadoraServico } from './info-empresa-tomadora-servico.entity';

export class InformacoesEmpresa {
  @Column({ name: 'info_empresa_nome' })
  nome: string;

  @Column({ name: 'info_empresa_cnpj' })
  cnpj: string;

  @Column(() => InfoEmpresaTomadoraServico)
  tomadoraServico: InfoEmpresaTomadoraServico;
}
