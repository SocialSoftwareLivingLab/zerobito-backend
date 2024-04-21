import { UsuarioEntity } from '@/app/usuarios/usuarios.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import InformacoesBasicas from './info-basicas/info-basica.entity';

@Entity({ name: 'caso' })
export default class CasoEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome: string;

  @ManyToOne(() => UsuarioEntity, { eager: true })
  @JoinColumn({ name: 'id_usuario_coordenador' })
  coordenador: UsuarioEntity;

  @ManyToOne(() => UsuarioEntity, { eager: true })
  @JoinColumn({ name: 'id_usuario_criador' })
  criador: UsuarioEntity;

  @Column(() => InformacoesBasicas, { prefix: false })
  informacoesBasicas: InformacoesBasicas;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;
}
