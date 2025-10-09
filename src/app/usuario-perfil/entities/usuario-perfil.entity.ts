import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UsuarioEntity } from '@/app/usuarios/usuarios.entity';
import { PerfilEntity } from '@/app/usuarios/entities/perfil.entity';
import CasoEntity from '@/app/casos/entities/caso.entity';

@Entity({ name: 'usuario_perfil' })
export default class UsuarioPerfilEntity {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  // Chaves primárias compostas
  @Column({ type: 'bigint', name: 'user_id' })
  userId: number;

  @Column({ type: 'bigint', name: 'perfil_id' })
  perfilId: number;

  @ManyToOne(() => UsuarioEntity, {nullable: false })
  @JoinColumn({ name: 'user_id' })
  usuario: UsuarioEntity;

  @ManyToOne(() => PerfilEntity, { eager: true, nullable: false })
  @JoinColumn({ name: 'perfil_id' })
  perfil: PerfilEntity;

  @ManyToOne(() => CasoEntity, {nullable: true })
  caso?: CasoEntity; // opcional, pode existir perfil global
}
