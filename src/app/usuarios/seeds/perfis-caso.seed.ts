import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import SeedRunner from '@/shared/seeds/seed-runner';
import { PerfilEntity } from '../entities/perfil.entity';
import { PermissaoEntity } from '../entities/permissao.entity';
import { PermissaoEnum } from '../enums/permissoes.enum';

const perfisCaso = [
  {
    codigo: 'MEMBRO',
    nome: 'Membro do Caso',
    descricao: 'Perfil básico para membros do grupo de trabalho de casos',
    isPerfilCaso: true,
    permissoes: [
      PermissaoEnum.CASOS_VER_NOTIFICACOES,
      PermissaoEnum.CASOS_VISUALIZAR,
    ],
  },
  {
    codigo: 'COORDENADOR',
    nome: 'Coordenador do Caso',
    descricao: 'Perfil para coordenação completa de casos',
    isPerfilCaso: true,
    permissoes: [
      // Todas as permissões de membro
      PermissaoEnum.CASOS_VISUALIZAR,
      PermissaoEnum.CASOS_ALTERAR_DATA_OBITO,
      PermissaoEnum.CASOS_ALTERAR_DATA_ACIDENTE,
      PermissaoEnum.CASOS_DEFINIR_CAUSA_PRIMARIA,
      PermissaoEnum.CASOS_DEFINIR_CAUSA_SECUNDARIA,
      PermissaoEnum.CASOS_DEFINIR_DIAGNOSTICO,
      PermissaoEnum.CASOS_DEFINIR_COMENTARIOS,
      PermissaoEnum.CASOS_DEFINIR_LOCALIZACAO,
      PermissaoEnum.CASOS_CADASTRAR_CAUSAS,
      PermissaoEnum.CASOS_CADASTRAR_DIAGNOSTICOS,
      PermissaoEnum.CASOS_VER_NOTIFICACOES,
      PermissaoEnum.CASOS_REGISTRAR_NOTIFICACAO,
      PermissaoEnum.CASOS_CADASTRAR_TIPOS_NOTIFICACAO,
      PermissaoEnum.CASOS_ENVIAR_CONVITE_MEMBRO,
      PermissaoEnum.CASOS_EDITAR_ATA,
    ],
  },
];

@Injectable()
export default class PerfisCasoSeed implements SeedRunner {
  private readonly logger = new Logger(PerfisCasoSeed.name);

  constructor(
    @InjectRepository(PerfilEntity)
    private readonly perfilRepository: Repository<PerfilEntity>,
    @InjectRepository(PermissaoEntity)
    private readonly permissaoRepository: Repository<PermissaoEntity>,
  ) {}

  async run(): Promise<void> {
    this.logger.log('Iniciando seed de perfis de caso...');

    for (const perfilData of perfisCaso) {
      const perfilExistente = await this.perfilRepository.findOne({
        where: { codigo: perfilData.codigo },
      });

      if (perfilExistente) {
        this.logger.log(`Perfil ${perfilData.codigo} já existe, pulando...`);
        continue;
      }

      // Buscar as permissões
      const permissoes = await this.permissaoRepository.find({
        where: perfilData.permissoes.map((codigo) => ({ codigo })),
      });

      if (permissoes.length !== perfilData.permissoes.length) {
        this.logger.warn(
          `Nem todas as permissões foram encontradas para o perfil ${perfilData.codigo}`,
        );
      }

      // Criar o perfil
      const novoPerfil = this.perfilRepository.create({
        codigo: perfilData.codigo,
        nome: perfilData.nome,
        descricao: perfilData.descricao,
        isPerfilCaso: perfilData.isPerfilCaso,
        permissoes,
      });

      await this.perfilRepository.save(novoPerfil);
      this.logger.log(`Perfil ${perfilData.codigo} criado com sucesso`);
    }

    this.logger.log('Seed de perfis de caso concluído');
  }
}
