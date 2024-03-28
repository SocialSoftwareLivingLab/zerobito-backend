import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { Protegido } from './decorators/protegido.decorator';
import { LoginDto } from './dtos/login.request.dto';
import { LoginResponse } from './dtos/login.response.dto';

@Controller('/api/v1/auth')
@ApiTags('Autenticacao')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Realiza a autenticação de um usuário na plataforma
   * @returns token de autenticação do usuário
   */
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiBody({
    description: 'Dados para realizar a autenticação',
    type: LoginDto,
  })
  async login(@Req() req: Request): Promise<LoginResponse> {
    return await this.authService.gerarTokenAutenticacao(req);
  }

  @Protegido()
  @Get('/perfil')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Retorna o perfil do usuário autenticado' })
  public async meuPerfil() {
    return 'meu perfil';
  }
}
