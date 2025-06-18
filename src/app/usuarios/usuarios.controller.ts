import { UsuariosService } from '@/app/usuarios/usuarios.service';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CriarUsuarioRequestDto,
  CriarUsuarioResponseDto,
} from './dtos/criar-usuario.dto';
import { PerfilUsuario } from './enums/perfil-usuario.enum';
import { RedefinirSenhaDto } from './dtos/redefinir-senha.dto';

// TODO: Adicionar funcionalidade de cadastro quando o admin conseguir criar usuários na plataforma
// @ApiBearerAuth()
@ApiTags('Usuarios')
@Controller('/api/v1/usuarios')
export class UsuariosController {
  constructor(private readonly usuarioService: UsuariosService) {}

  @Post()
  @ApiOperation({
    description: 'Adiciona um novo usuário na plataforma',
    summary: 'Adicionar novo usuário',
  })
  @ApiCreatedResponse({
    type: CriarUsuarioResponseDto,
    description: 'Usuário criado',
  })
  // @Protegido()
  // @Perfil(PerfilUsuario.ADMIN)
  public async adicionar(
    @Body() body: CriarUsuarioRequestDto,
  ): Promise<CriarUsuarioResponseDto> {
    const { id, nome, email, dataCriacao } =
      await this.usuarioService.adicionar(body, PerfilUsuario.USER);

    return { id, nome, email, dataCriacao };
  }

  @Post('redefinir-email')
  @ApiOperation({
    description: 'Manda e-mail para redefinição de senha',
    summary: 'Manda-email para redefinição de senha',
  })
  @ApiCreatedResponse({
    description: 'Usuário criado',
  })
  // @Protegido()
  // @Perfil(PerfilUsuario.ADMIN)
  public async emailRedefinicao(
  @Body('email') email: string,
): Promise<{ mensagem: string }> {
  await this.usuarioService.enviarEmailRedefinicaoSenha(email);
  return { mensagem: 'E-mail de redefinição enviado com sucesso' };
}

@Post('redefinir')
@ApiOperation({
  description: 'Redefine a senha do usuário com base em um token',
  summary: 'Redefinir senha do usuário',
})
@ApiCreatedResponse({
  description: 'Senha redefinida com sucesso',
})
public async redefinirSenha(
  @Body() body: RedefinirSenhaDto,
): Promise<{ mensagem: string }> {
  const sucesso = await this.usuarioService.redefinirSenha(body.token, body.senha);

  return { mensagem: 'Senha redefinida com sucesso' };
}
}
