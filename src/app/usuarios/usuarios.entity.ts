import { CriptografiaHelper } from 'src/helpers/criptografia.helper';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PerfilUsuario } from './enums/perfil-usuario.enum';
import { PerfilEntity } from './entities/perfil.entity';

@Entity({ name: 'usuario' })
export class UsuarioEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column()
  senha: string;

  @Column({ name: 'perfil_usuario', enum: PerfilUsuario, type: 'enum' })
  permissao: PerfilUsuario;

  @ManyToOne(() => PerfilEntity)
  @JoinColumn({ name: 'id_perfil' })
  perfil: PerfilEntity;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;

  @UpdateDateColumn({ name: 'data_alteracao' })
  dataAlteracao: Date;

  @DeleteDateColumn({ name: 'data_exclusao' })
  dataExclusao: Date;

  @BeforeInsert()
  beforeInsert() {
    this.senha = CriptografiaHelper.gerarHash(this.senha);
  }
}
