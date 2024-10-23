import { OcorrenciaEntity } from '@/app/ocorrencias/entities/ocorrencias.entity';
import { UsuarioEntity } from '@/app/usuarios/usuarios.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import InformacoesBasicas from './info-basicas/info-basica.entity';
import PalavraChaveEntity from './palavra-chave.entity';
import Localizacao from './localizacao/localizacao.entity';
import LocalizacaoCaso from './localizacao/localizacao.entity';
import { StatusCasoEnum } from './status-caso.enum';

@Entity({ name: 'caso' })
export default class CasoEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome: string;

  @Column({ name: 'dataObito', type: 'date', nullable: true })
  dataObito: Date;

  @Column({ name: 'dataCaso', type: 'date', nullable: true })
  dataCaso: Date;

  @Column({
    type: 'enum',
    enum: StatusCasoEnum,
    default: StatusCasoEnum.AGUARDANDO_NOTIFICACOES,
    name: 'permissao',
  })
  status: StatusCasoEnum;

  @ManyToOne(() => UsuarioEntity)
  @JoinColumn({ name: 'id_usuario_coordenador' })
  coordenador: UsuarioEntity;

  @ManyToOne(() => UsuarioEntity)
  @JoinColumn({ name: 'id_usuario_criador' })
  criador: UsuarioEntity;

  @ManyToMany(() => OcorrenciaEntity)
  @JoinTable({
    name: 'caso_ocorrencia',
    joinColumn: { name: 'id_caso' },
    inverseJoinColumn: { name: 'id_ocorrencia' },
  })
  ocorrencias: OcorrenciaEntity[];

  @Column(() => InformacoesBasicas, { prefix: false })
  informacoesBasicas: InformacoesBasicas;

  @Column(() => Localizacao, { prefix: false })
  localizacao: LocalizacaoCaso;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;

  @OneToMany(() => PalavraChaveEntity, (palavraChave) => palavraChave.caso)
  palavrasChave: PalavraChaveEntity[];
}
