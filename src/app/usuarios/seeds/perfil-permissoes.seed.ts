import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import SeedRunner from '@/shared/seeds/seed-runner';
import { PerfilEntity } from '../entities/perfil.entity';
import { PermissaoEntity } from '../entities/permissao.entity';
import { PerfilUsuario } from '../enums/perfil-usuario.enum';
import { PermissaoEnum } from '../enums/permissoes.enum';

// Mapeamento de perfis para suas permissões específicas baseado nos requisitos
const perfilPermissoes = {
  [PerfilUsuario.ROOT]: [
    // Todas as permissões do sistema (ROOT tem acesso total)
    PermissaoEnum.SISTEMA_CRIAR_ADMIN,
    PermissaoEnum.OCORRENCIAS_VISUALIZAR,
    PermissaoEnum.OCORRENCIAS_CRIAR,
    PermissaoEnum.OCORRENCIAS_ACEITAR,
    PermissaoEnum.OCORRENCIAS_NAO_INCORPORAR,
    PermissaoEnum.CASOS_VISUALIZAR_TODOS,
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
  ],
  [PerfilUsuario.ADMIN]: [
    // Permissões administrativas (sem criar outros admins)
    PermissaoEnum.OCORRENCIAS_VISUALIZAR,
    PermissaoEnum.OCORRENCIAS_CRIAR,
    PermissaoEnum.OCORRENCIAS_ACEITAR,
    PermissaoEnum.OCORRENCIAS_NAO_INCORPORAR,
    PermissaoEnum.CASOS_VISUALIZAR_TODOS,
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
  ],
  [PerfilUsuario.COORDENADOR]: [
    // Permissões de coordenação de casos
    PermissaoEnum.OCORRENCIAS_VISUALIZAR,
    PermissaoEnum.OCORRENCIAS_ACEITAR,
    PermissaoEnum.OCORRENCIAS_NAO_INCORPORAR,
    PermissaoEnum.CASOS_VISUALIZAR_TODOS,
    PermissaoEnum.CASOS_ALTERAR_DATA_OBITO,
    PermissaoEnum.CASOS_ALTERAR_DATA_ACIDENTE,
    PermissaoEnum.CASOS_DEFINIR_CAUSA_PRIMARIA,
    PermissaoEnum.CASOS_DEFINIR_CAUSA_SECUNDARIA,
    PermissaoEnum.CASOS_DEFINIR_DIAGNOSTICO,
    PermissaoEnum.CASOS_DEFINIR_COMENTARIOS,
    PermissaoEnum.CASOS_DEFINIR_LOCALIZACAO,
    PermissaoEnum.CASOS_VER_NOTIFICACOES,
    PermissaoEnum.CASOS_REGISTRAR_NOTIFICACAO,
    PermissaoEnum.CASOS_ENVIAR_CONVITE_MEMBRO,
  ],
  [PerfilUsuario.USER]: [
    // Permissões básicas de usuário
    PermissaoEnum.OCORRENCIAS_VISUALIZAR,
    PermissaoEnum.OCORRENCIAS_CRIAR,
    PermissaoEnum.CASOS_VISUALIZAR_TODOS,
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
