import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntity } from '@/app/usuarios/usuarios.entity';
import { PerfilEntity } from '@/app/usuarios/entities/perfil.entity';
import CasoEntity from '@/app/casos/entities/caso.entity';
import UsuarioPerfilEntity from './usuario-perfil.entity';

@Injectable()
export class UsuarioPerfilService {
  constructor(
    @InjectRepository(UsuarioPerfilEntity)
    private readonly perfilUsuarioRepository: Repository<UsuarioPerfilEntity>,

    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,

    @InjectRepository(PerfilEntity)
    private readonly perfilRepository: Repository<PerfilEntity>,

    @InjectRepository(CasoEntity)
    private readonly casoRepository: Repository<CasoEntity>,
  ) {}

  /**
   * Cria um novo PerfilUsuario, garantindo que o usuário só pode ter
   * um perfil por caso
   */
  async criarPerfilUsuario(
    idUsuario: number,
    idPerfil: number,
    idCaso?: number,
  ): Promise<UsuarioPerfilEntity> {
    const usuario = await this.usuarioRepository.findOne({ where: { id: idUsuario } });
    const perfil = await this.perfilRepository.findOne({ where: { id: idPerfil } });
    const caso = idCaso ? await this.casoRepository.findOne({ where: { id: idCaso } }) : null;

    if (!usuario) throw new Error('Usuário não encontrado');
    if (!perfil) throw new Error('Perfil não encontrado');
    if (idCaso && !caso) throw new Error('Caso não encontrado');

    // ✅ validação: só pode haver 1 perfil para o mesmo usuário no mesmo caso
    if (caso) {
      const existente = await this.perfilUsuarioRepository.findOne({
        where: { usuario: { id: usuario.id }, caso: { id: caso.id } },
      });

      if (existente) {
        throw new Error('Usuário já possui um perfil para este caso');
      }
    }

    const perfilUsuario = this.perfilUsuarioRepository.create({
      usuario,
      perfil,
      caso,
    });

    return this.perfilUsuarioRepository.save(perfilUsuario);
  }

  /**
   * Lista todos os perfis de um usuário
   */
  async listarPerfisDoUsuario(idUsuario: number): Promise<UsuarioPerfilEntity[]> {
    return this.perfilUsuarioRepository.find({
      where: { usuario: { id: idUsuario } },
      relations: ['perfil', 'caso'],
    });
  }

  /**
   * Remove (ou desativa) um perfil de usuário
   */
  async removerPerfilUsuario(id: number): Promise<void> {
    await this.perfilUsuarioRepository.delete(id);
  }

  /**
   * Obtém permissões de um usuário em um caso
   */
  async obterPermissoesUsuarioNoCaso(
    idUsuario: number,
    idCaso: number,
  ): Promise<string[]> {
    const perfilUsuario = await this.perfilUsuarioRepository.findOne({
      where: { usuario: { id: idUsuario }, caso: { id: idCaso } },
      relations: ['perfil', 'perfil.permissoes'],
    });

    if (!perfilUsuario?.perfil?.permissoes) return [];

    return perfilUsuario.perfil.permissoes.map((p) => p.codigo);
  }
}
