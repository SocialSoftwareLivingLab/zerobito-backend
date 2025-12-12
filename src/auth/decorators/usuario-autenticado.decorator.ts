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
 * Verifica se o usuário possui uma permissão em **algum dos perfis**
 */
export function usuarioTemPermissao(
  usuario: UsuarioAutenticadoDto,
  permissao: string,
): boolean {
  if (!usuario?.perfis?.length) {
    return false;
  }

  return usuario.perfis.some((perfil) =>
    perfil.permissoes?.includes(permissao),
  );
}

/**
 * Obtém todas as permissões do usuário (de todos os perfis, sem duplicadas)
 */
export function obterPermissoesUsuario(
  usuario: UsuarioAutenticadoDto,
): string[] {
  if (!usuario?.perfis?.length) {
    return [];
  }

  const permissoes = usuario.perfis.flatMap((perfil) => perfil.permissoes || []);
  return [...new Set(permissoes)]; // remove duplicadas
}
