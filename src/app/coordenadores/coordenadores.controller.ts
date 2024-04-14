import { Protegido } from '@/auth/decorators/protegido.decorator';
import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Perfil } from '../usuarios/decorators/perfil.decorator';
import { PerfilUsuario } from '../usuarios/enums/perfil-usuario.enum';
import { CoordenadoresService } from './coordenadores.service';

@Protegido()
@ApiBearerAuth()
@ApiTags('Coordenadores')
@Controller('/api/v1/coordenadores')
export class CoordenadoresController {
  constructor(private readonly coordenadoresService: CoordenadoresService) {}

  @Get()
  @ApiOperation({
    description: 'Busca os coordenadores cadastrados na plataforma',
    summary: 'Consultar coordenadores',
  })
  @ApiQuery({
    name: 'nome',
    description: 'Nome do coordenador',
    required: false,
  })
  @Perfil(PerfilUsuario.USER, PerfilUsuario.COORDENADOR)
  public async buscarCoordenadores(
    @Query('nome')
    nome: string,
  ) {
    return this.coordenadoresService.buscarCoordenadores({ nome });
  }
}
