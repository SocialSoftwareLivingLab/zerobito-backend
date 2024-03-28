import { CriptografiaHelper } from 'src/helpers/criptografia.helper';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PerfilUsuario } from './enums/perfil-usuario.enum';

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
