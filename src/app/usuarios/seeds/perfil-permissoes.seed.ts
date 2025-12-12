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
    PermissaoEnum.OCORRENCIAS_VISUALIZAR_TODOS,
    PermissaoEnum.OCORRENCIAS_CRIAR,
    PermissaoEnum.OCORRENCIAS_ACEITAR,
    PermissaoEnum.OCORRENCIAS_NAO_INCORPORAR,
    PermissaoEnum.COORDENADORES_VISUALIZAR,
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
    PermissaoEnum.CASOS_ALTERAR_MAPA,
  ],
  [PerfilUsuario.ADMIN]: [
    // Permissões administrativas (sem criar outros admins)
    PermissaoEnum.SISTEMA_CRIAR_ADMIN,
    PermissaoEnum.OCORRENCIAS_VISUALIZAR,
    PermissaoEnum.OCORRENCIAS_VISUALIZAR_TODOS,
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
    PermissaoEnum.COORDENADORES_VISUALIZAR,
    PermissaoEnum.CASOS_ALTERAR_MAPA,
  ],
  [PerfilUsuario.USER]: [
    // Permissões básicas de usuário
    PermissaoEnum.OCORRENCIAS_VISUALIZAR_TODOS,
    PermissaoEnum.OCORRENCIAS_VISUALIZAR,
  ],
  [PerfilUsuario.ANALISTA_CEREST]: [
    PermissaoEnum.OCORRENCIAS_VISUALIZAR_TODOS,
    PermissaoEnum.OCORRENCIAS_VISUALIZAR,
    PermissaoEnum.OCORRENCIAS_CRIAR,
    PermissaoEnum.CASOS_VISUALIZAR_TODOS,
    PermissaoEnum.OCORRENCIAS_ACEITAR,
    PermissaoEnum.OCORRENCIAS_NAO_INCORPORAR,
  ],
  [PerfilUsuario.COORDENADOR_DE_CASO]: [
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
    PermissaoEnum.CASOS_ALTERAR_MAPA,
  ],
  [PerfilUsuario.MEMBRO_CASO]: [
    PermissaoEnum.CASOS_VISUALIZAR,
  ]

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
    this.logger.log('Sincronizando relacionamentos perfil-permissão...');

    // Buscar todos os perfis e permissões
    const perfis = await this.perfilRepository.find({
      relations: ['permissoes'],
    });
    const permissoes = await this.permissaoRepository.find();

    // Criar mapeamento de códigos para facilitar busca
    const perfilMap = new Map(perfis.map((p) => [p.codigo, p]));
    const permissaoMap = new Map(permissoes.map((p) => [p.codigo, p]));

    let perfisAtualizados = 0;
    let relacionamentosAdicionados = 0;
    let relacionamentosRemovidos = 0;

    // Sincronizar relacionamentos para cada perfil
    for (const [codigoPerfil, codigosPermissoesDesejadas] of Object.entries(
      perfilPermissoes,
    )) {
      const perfil = perfilMap.get(codigoPerfil);
      if (!perfil) {
        this.logger.warn(`Perfil ${codigoPerfil} não encontrado`);
        continue;
      }

      // Buscar permissões que devem estar associadas a este perfil
      const permissoesDesejadas: PermissaoEntity[] = [];
      const permissoesNaoEncontradas: string[] = [];

      for (const codigoPermissao of codigosPermissoesDesejadas) {
        const permissao = permissaoMap.get(codigoPermissao);
        if (permissao) {
          permissoesDesejadas.push(permissao);
        } else {
          permissoesNaoEncontradas.push(codigoPermissao);
        }
      }

      if (permissoesNaoEncontradas.length > 0) {
        this.logger.warn(
          `Permissões não encontradas para perfil ${codigoPerfil}: ${permissoesNaoEncontradas.join(', ')}`,
        );
      }

      // Verificar se precisa atualizar o perfil
      const permissoesAtuais = perfil.permissoes || [];
      const idsPermissoesAtuais = new Set(permissoesAtuais.map((p) => p.id));
      const idsPermissoesDesejadas = new Set(
        permissoesDesejadas.map((p) => p.id),
      );

      // Verificar se há diferenças
      const precisaAtualizar =
        idsPermissoesAtuais.size !== idsPermissoesDesejadas.size ||
        !Array.from(idsPermissoesDesejadas).every((id) =>
          idsPermissoesAtuais.has(id),
        );

      if (precisaAtualizar) {
        // Calcular diferenças para logging
        const adicionadas = permissoesDesejadas.filter(
          (p) => !idsPermissoesAtuais.has(p.id),
        );
        const removidas = permissoesAtuais.filter(
          (p) => !idsPermissoesDesejadas.has(p.id),
        );

        relacionamentosAdicionados += adicionadas.length;
        relacionamentosRemovidos += removidas.length;

        // Atualizar relacionamentos
        perfil.permissoes = permissoesDesejadas;
        await this.perfilRepository.save(perfil);
        perfisAtualizados++;

        this.logger.log(
          `Perfil ${perfil.nome} atualizado: +${adicionadas.length} -${removidas.length} permissões (total: ${permissoesDesejadas.length})`,
        );

        if (adicionadas.length > 0) {
          this.logger.debug(
            `  Adicionadas: ${adicionadas.map((p) => p.codigo).join(', ')}`,
          );
        }

        if (removidas.length > 0) {
          this.logger.debug(
            `  Removidas: ${removidas.map((p) => p.codigo).join(', ')}`,
          );
        }
      }
    }

    this.logger.log(
      `Sincronização concluída: ${perfisAtualizados} perfis atualizados, +${relacionamentosAdicionados} -${relacionamentosRemovidos} relacionamentos`,
    );
  }
}
