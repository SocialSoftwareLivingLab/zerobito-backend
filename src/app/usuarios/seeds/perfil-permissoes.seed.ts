import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import SeedRunner from '@/shared/seeds/seed-runner';
import { PerfilEntity } from '../entities/perfil.entity';
import { PermissaoEntity } from '../entities/permissao.entity';
import { PerfilUsuario } from '../enums/perfil-usuario.enum';

// Mapeamento de perfis para suas permissões básicas
const perfilPermissoes = {
  [PerfilUsuario.ROOT]: [
    'USERS_CREATE',
    'USERS_READ',
    'USERS_UPDATE',
    'USERS_DELETE',
    'CASES_CREATE',
    'CASES_READ',
    'CASES_UPDATE',
    'CASES_DELETE',
    'CASES_COORDINATE',
    'OCCURRENCES_CREATE',
    'OCCURRENCES_READ',
    'OCCURRENCES_UPDATE',
    'OCCURRENCES_DELETE',
  ],
  [PerfilUsuario.ADMIN]: [
    'USERS_CREATE',
    'USERS_READ',
    'USERS_UPDATE',
    'CASES_CREATE',
    'CASES_READ',
    'CASES_UPDATE',
    'CASES_DELETE',
    'CASES_COORDINATE',
    'OCCURRENCES_CREATE',
    'OCCURRENCES_READ',
    'OCCURRENCES_UPDATE',
    'OCCURRENCES_DELETE',
  ],
  [PerfilUsuario.COORDENADOR]: [
    'CASES_CREATE',
    'CASES_READ',
    'CASES_UPDATE',
    'CASES_COORDINATE',
    'OCCURRENCES_CREATE',
    'OCCURRENCES_READ',
    'OCCURRENCES_UPDATE',
  ],
  [PerfilUsuario.USER]: [
    'CASES_READ',
    'OCCURRENCES_CREATE',
    'OCCURRENCES_READ',
    'OCCURRENCES_UPDATE',
  ],
};

@Injectable()
export default class PerfilPermissoesSeed implements SeedRunner {
  private readonly logger = new Logger(PerfilPermissoesSeed.name);

  constructor(
    @InjectRepository(PerfilEntity)
    private readonly perfilRepository: Repository<PerfilEntity>,
    @InjectRepository(PermissaoEntity)
    private readonly permissaoRepository: Repository<PermissaoEntity>,
  ) {}

  async run() {
    this.logger.log('Seed dos relacionamentos perfil-permissão...');

    // Verificar se já existem relacionamentos
    const perfisComPermissoes = await this.perfilRepository.find({
      relations: ['permissoes'],
      where: {},
    });

    const jaTemRelacionamentos = perfisComPermissoes.some(
      (p) => p.permissoes.length > 0,
    );
    if (jaTemRelacionamentos) return;

    this.logger.log('Criando relacionamentos entre perfis e permissões');

    // Buscar todos os perfis e permissões
    const perfis = await this.perfilRepository.find();
    const permissoes = await this.permissaoRepository.find();

    // Criar mapeamento de códigos para facilitar busca
    const perfilMap = new Map(perfis.map((p) => [p.codigo, p]));
    const permissaoMap = new Map(permissoes.map((p) => [p.codigo, p]));

    // Criar relacionamentos
    for (const [codigoPerfil, codigosPermissoes] of Object.entries(
      perfilPermissoes,
    )) {
      const perfil = perfilMap.get(codigoPerfil);
      if (!perfil) {
        this.logger.warn(`Perfil ${codigoPerfil} não encontrado`);
        continue;
      }

      // Buscar as permissões para este perfil
      const permissoesParaPerfil: PermissaoEntity[] = [];
      for (const codigoPermissao of codigosPermissoes) {
        const permissao = permissaoMap.get(codigoPermissao);
        if (!permissao) {
          this.logger.warn(`Permissão ${codigoPermissao} não encontrada`);
          continue;
        }
        permissoesParaPerfil.push(permissao);
      }

      // Associar as permissões ao perfil
      perfil.permissoes = permissoesParaPerfil;
      await this.perfilRepository.save(perfil);

      this.logger.log(
        `Relacionamentos criados para perfil: ${perfil.nome} (${permissoesParaPerfil.length} permissões)`,
      );
    }
  }
}
