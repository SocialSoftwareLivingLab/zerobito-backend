import { SetMetadata } from '@nestjs/common';
import { PermissaoEnum } from '@/app/usuarios/enums/permissoes.enum';

export const PERMISSAO_CASO_KEY = 'permissao_caso';

/**
 * Decorator para verificar permissões específicas de caso
 * O guard irá verificar se o usuário tem a permissão através de seu perfil no caso específico
 *
 * @param permissoes - Lista de permissões que o usuário deve ter no caso
 *
 * @example
 * @PermissaoCaso(PermissaoEnum.CASOS_DEFINIR_COMENTARIOS)
 * async definirComentario(@Param('idCaso') idCaso: number) { ... }
 */
export const PermissaoCaso = (...permissoes: PermissaoEnum[]) =>
  SetMetadata(PERMISSAO_CASO_KEY, permissoes);
