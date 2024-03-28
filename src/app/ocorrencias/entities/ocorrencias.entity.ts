import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatusOcorrenciaEntity } from './status-ocorrencias.entity';
import { LocalOcorrencia } from './local.entity';
import { InformacoesVitima } from './info-vitima.entity';
import { InformacoesEmpresa } from './info-empresa.entity';
import { InformacoesFonte } from './info-fonte.entity';

@Entity({ name: 'ocorrencia' })
export class OcorrenciaEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'descricao' })
  descricao: string;

  @Column({ name: 'data', nullable: false })
  data: Date;

  @JoinColumn({ name: 'id_status' })
  @ManyToOne(() => StatusOcorrenciaEntity)
  status: StatusOcorrenciaEntity;

  @Column(() => LocalOcorrencia, { prefix: false })
  local: LocalOcorrencia;

  @Column(() => InformacoesVitima, { prefix: false })
  vitima: InformacoesVitima;

  @Column(() => InformacoesEmpresa, { prefix: false })
  empresa: InformacoesEmpresa;

  @Column(() => InformacoesFonte, { prefix: false })
  fonte: InformacoesFonte;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;

  @UpdateDateColumn({ name: 'data_alteracao' })
  dataAlteracao: Date;

  @DeleteDateColumn({ name: 'data_exclusao' })
  dataExclusao: Date;
}
