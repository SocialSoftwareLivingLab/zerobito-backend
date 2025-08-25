import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerfilEntity } from '../entities/perfil.entity';
import { PermissaoEntity } from '../entities/permissao.entity';
import { Optional } from 'typescript-optional';

@Injectable()
export class PerfisService {
  private readonly logger = new Logger(PerfisService.name);

  constructor(
    @InjectRepository(PerfilEntity)
    private readonly perfilRepository: Repository<PerfilEntity>,
    @InjectRepository(PermissaoEntity)
    private readonly permissaoRepository: Repository<PermissaoEntity>,
  ) {}

  async buscarPerfilPorCodigo(codigo: string): Promise<Optional<PerfilEntity>> {
    const perfil = await this.perfilRepository.findOne({
      where: { codigo },
      relations: ['permissoes'],
    });

    return Optional.ofNullable(perfil);
  }

  async buscarPerfilPorId(id: number): Promise<Optional<PerfilEntity>> {
    const perfil = await this.perfilRepository.findOne({
      where: { id },
      relations: ['permissoes'],
    });

    return Optional.ofNullable(perfil);
  }

  async listarPerfis(): Promise<PerfilEntity[]> {
    return await this.perfilRepository.find({
      relations: ['permissoes'],
    });
  }

  async buscarPermissoesDoPerfil(perfilId: number): Promise<PermissaoEntity[]> {
    const perfil = await this.perfilRepository.findOne({
      where: { id: perfilId },
      relations: ['permissoes'],
    });

    return perfil?.permissoes || [];
  }

  async listarPermissoes(): Promise<PermissaoEntity[]> {
    return await this.permissaoRepository.find();
  }

  async verificarPermissao(
    perfilId: number,
    codigoPermissao: string,
  ): Promise<boolean> {
    const perfil = await this.perfilRepository.findOne({
      where: { id: perfilId },
      relations: ['permissoes'],
    });

    if (!perfil) return false;

    return perfil.permissoes.some(
      (permissao) => permissao.codigo === codigoPermissao,
    );
  }
}
