import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import SeedRunner from '@/shared/seeds/seed-runner';
import { PerfilEntity } from '../entities/perfil.entity';
import { PerfilUsuario } from '../enums/perfil-usuario.enum';

const perfis = [
  {
    codigo: PerfilUsuario.ADMIN,
    nome: 'Administrador',
    descricao: 'Perfil com privilégios administrativos completos',
    isPerfilCaso: false,
  },
  {
    codigo: PerfilUsuario.ROOT,
    nome: 'Root',
    descricao: 'Perfil com privilégios de sistema completos',
    isPerfilCaso: false,
  },
  {
    codigo: PerfilUsuario.USER,
    nome: 'Usuário',
    descricao: 'Perfil básico de usuário',
    isPerfilCaso: false,
  },
];

@Injectable()
export default class PerfisSeed implements SeedRunner {
  private readonly logger = new Logger(PerfisSeed.name);

  constructor(
    @InjectRepository(PerfilEntity)
    private readonly perfilRepository: Repository<PerfilEntity>,
  ) {}

  async run() {
    this.logger.log('Sincronizando perfis com o enum...');

    // Buscar perfis existentes na base
    const perfisExistentes = await this.perfilRepository.find();

    let perfisCriados = 0;
    let perfisAtualizados = 0;

    // Processar cada perfil do mapeamento
    for (const perfilData of perfis) {
      const perfilExistente = perfisExistentes.find(
        (p) => p.codigo === perfilData.codigo,
      );

      if (perfilExistente) {
        // Atualizar se necessário
        let precisaAtualizar = false;

        if (perfilExistente.nome !== perfilData.nome) {
          perfilExistente.nome = perfilData.nome;
          precisaAtualizar = true;
        }

        if (perfilExistente.descricao !== perfilData.descricao) {
          perfilExistente.descricao = perfilData.descricao;
          precisaAtualizar = true;
        }

        if (perfilExistente.isPerfilCaso !== perfilData.isPerfilCaso) {
          perfilExistente.isPerfilCaso = perfilData.isPerfilCaso;
          precisaAtualizar = true;
        }

        if (precisaAtualizar) {
          await this.perfilRepository.save(perfilExistente);
          perfisAtualizados++;
          this.logger.log(`Perfil "${perfilData.nome}" atualizado`);
        }
      } else {
        // Criar novo perfil
        const novoPerfil = this.perfilRepository.create(perfilData);
        await this.perfilRepository.save(novoPerfil);
        perfisCriados++;
        this.logger.log(`Perfil "${perfilData.nome}" criado com sucesso`);
      }
    }

    // Verificar perfis órfãos (existem na base mas não no enum)
    const codigosMapeamento = new Set(perfis.map((p) => p.codigo));
    const perfisOrfaos = perfisExistentes.filter(
      (p) => !codigosMapeamento.has(p.codigo as any),
    );

    if (perfisOrfaos.length > 0) {
      this.logger.warn(
        `${perfisOrfaos.length} perfis órfãos encontrados na base: ${perfisOrfaos.map((p) => p.codigo).join(', ')}`,
      );
    }

    this.logger.log(
      `Sincronização concluída: ${perfisCriados} criados, ${perfisAtualizados} atualizados`,
    );
  }
}
