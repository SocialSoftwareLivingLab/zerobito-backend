import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import MembroGrupoTrabalhoEntity from '@/app/casos-grupo-trabalho/entities/membro-grupo.entity';
import { PermissaoEnum } from '@/app/usuarios/enums/permissoes.enum';
import { PerfilEntity } from '@/app/usuarios/entities/perfil.entity';

@Injectable()
export class CasosPermissaoService {
  constructor(
    @InjectRepository(MembroGrupoTrabalhoEntity)
    private readonly membroGrupoRepository: Repository<MembroGrupoTrabalhoEntity>,
    @InjectRepository(PerfilEntity)
    private readonly perfilRepository: Repository<PerfilEntity>,
  ) {}

  /**
   * Verifica se um usuário tem uma permissão específica em um caso
   */
  async verificarPermissaoCaso(
    idUsuario: number,
    idCaso: number,
    permissao: PermissaoEnum,
  ): Promise<boolean> {
    // Buscar o membro no grupo de trabalho do caso
    const membro = await this.membroGrupoRepository.findOne({
      where: {
        membro: { id: idUsuario },
        caso: { id: idCaso },
        dataRemocao: null, // Apenas membros ativos
      },
      relations: ['caso', 'membro', 'perfil', 'perfil.permissoes'],
    });

    if (!membro || !membro.perfil) {
      return false;
    }

    // Verificar se o perfil possui a permissão
    return membro.perfil.permissoes.some((p) => p.codigo === permissao);
  }

  /**
   * Atribui um perfil a um membro de um caso
   */
  async atribuirPerfilMembro(
    idMembro: number,
    idPerfil: number,
  ): Promise<void> {
    // Verificar se o perfil é válido para casos
    const perfil = await this.perfilRepository.findOne({
      where: { id: idPerfil, isPerfilCaso: true },
    });

    if (!perfil) {
      throw new Error('Perfil não é válido para casos');
    }

    // Buscar o membro e atualizar seu perfil
    const membro = await this.membroGrupoRepository.findOne({
      where: { id: idMembro },
    });

    if (!membro) {
      throw new Error('Membro não encontrado');
    }

    membro.perfil = perfil;
    await this.membroGrupoRepository.save(membro);
  }

  /**
   * Remove o perfil de um membro do caso
   */
  async removerPerfilMembro(idMembro: number): Promise<void> {
    const membro = await this.membroGrupoRepository.findOne({
      where: { id: idMembro },
    });

    if (membro) {
      membro.perfil = null;
      await this.membroGrupoRepository.save(membro);
    }
  }

  /**
   * Lista todos os perfis válidos para casos
   */
  async listarPerfisParaCasos(): Promise<PerfilEntity[]> {
    return this.perfilRepository.find({
      where: { isPerfilCaso: true },
      relations: ['permissoes'],
    });
  }

  /**
   * Obtém as permissões de um usuário em um caso específico
   */
  async obterPermissoesUsuarioNoCaso(
    idUsuario: number,
    idCaso: number,
  ): Promise<PermissaoEnum[]> {
    const membro = await this.membroGrupoRepository.findOne({
      where: {
        membro: { id: idUsuario },
        caso: { id: idCaso },
        dataRemocao: null,
      },
      relations: ['perfil', 'perfil.permissoes'],
    });

    if (!membro?.perfil?.permissoes) {
      return [];
    }

    return membro.perfil.permissoes.map((p) => p.codigo as PermissaoEnum);
  }

  /**
   * Atribui automaticamente o perfil MEMBRO a um novo membro do grupo de trabalho
   */
  async atribuirPerfilMembroAutomatico(idMembro: number): Promise<void> {
    // Buscar o perfil MEMBRO
    const perfilMembro = await this.perfilRepository.findOne({
      where: { codigo: 'MEMBRO', isPerfilCaso: true },
    });

    if (!perfilMembro) {
      throw new Error('Perfil MEMBRO não encontrado');
    }

    // Buscar o membro e atribuir o perfil MEMBRO
    const membro = await this.membroGrupoRepository.findOne({
      where: { id: idMembro },
    });

    if (!membro) {
      throw new Error('Membro não encontrado');
    }

    // Se já tem um perfil, não alterar
    if (membro.perfil) {
      return;
    }

    // Atribuir o perfil MEMBRO
    membro.perfil = perfilMembro;
    await this.membroGrupoRepository.save(membro);
  }
}
