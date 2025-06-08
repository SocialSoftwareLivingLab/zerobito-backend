import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsuarioAutenticadoDto } from '../dtos/usuario-autenticado.dto';

export const UsuarioAutenticado = createParamDecorator(
  (data: string, ctx: ExecutionContext): UsuarioAutenticadoDto => {
    const request = ctx.switchToHttp().getRequest();
    const user: UsuarioAutenticadoDto = request.user;

    return data ? user?.[data] : user;
  },
);

/**
 * Função helper para verificar se o usuário possui uma permissão específica
 */
export function usuarioTemPermissao(
  usuario: UsuarioAutenticadoDto,
  permissao: string,
): boolean {
  if (!usuario?.perfilDetalhado?.permissoes) {
    return false;
  }

  return usuario.perfilDetalhado.permissoes.includes(permissao);
}

/**
 * Função helper para obter todas as permissões do usuário
 */
export function obterPermissoesUsuario(
  usuario: UsuarioAutenticadoDto,
): string[] {
  return usuario?.perfilDetalhado?.permissoes || [];
}
