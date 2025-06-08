import { SetMetadata } from '@nestjs/common';
import { PermissaoEnum } from '../enums/permissoes.enum';

export const PERMISSAO_KEY = 'permissao';

/**
 * Decorator para verificar permissões específicas
 * Agora com type safety usando o enum
 *
 * @example
 * @Permissao(PermissaoEnum.USUARIOS_CRIAR, PermissaoEnum.USUARIOS_ATUALIZAR)
 * async criarUsuario() { ... }
 */
export const Permissao = (...permissoes: PermissaoEnum[]) =>
  SetMetadata(PERMISSAO_KEY, permissoes);
