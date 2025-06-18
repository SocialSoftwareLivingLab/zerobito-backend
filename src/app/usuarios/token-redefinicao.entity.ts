// src/modules/usuario/entities/token-redefinicao.entity.ts

import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
  } from 'typeorm';
import { UsuarioEntity } from './usuarios.entity';
  
  @Entity('token_redefinicao_senha')
  export class TokenRedefinicaoSenhaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ unique: true })
    @Index()
    token: string;
  
    @ManyToOne(() => UsuarioEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuario_id' })
    usuario: UsuarioEntity;
  
    @Column({ type: 'timestamp' })
    expiracao: Date;
  
    @CreateDateColumn({ name: 'data_criacao' })
    dataCriacao: Date;
  }
  