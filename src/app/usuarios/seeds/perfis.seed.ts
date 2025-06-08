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
  {
    codigo: PerfilUsuario.COORDENADOR,
    nome: 'Coordenador',
    descricao: 'Perfil de coordenação de casos',
    isPerfilCaso: true,
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
    this.logger.log('Seed da tabela "perfil"...');

    const quantidade = await this.perfilRepository.count();
    if (quantidade > 0) return;

    this.logger.log('Criando perfis iniciais baseados no enum');

    for (const perfilData of perfis) {
      const perfil = this.perfilRepository.create(perfilData);
      await this.perfilRepository.save(perfil);
      this.logger.log(`Perfil "${perfilData.nome}" criado com sucesso`);
    }
  }
}
