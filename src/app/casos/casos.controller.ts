import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CasosService } from './casos.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CriarPalavraChaveApiRequest } from './payloads/palavra-chave/criar-palavra-chave.payload';
import { PalavraChaveService } from './palavra-chave.service';
import { CasoResponse } from './payloads/caso/caso.payload';

@ApiBearerAuth()
@ApiTags('Casos')
@Controller('/api/v1/casos')
export class CasosController {
  constructor(
    private readonly casosService: CasosService,
    private readonly palavraChaveService: PalavraChaveService,
  ) {}

  @ApiOperation({
    summary: 'Buscar todos os casos sumarizados',
    description:
      'Retorna a listagem atual de casos sem paginação e com dados básicos',
  })
  @Get()
  @ApiOkResponse({
    description: 'Casos encontrados',
    type: CasoResponse,
    isArray: true,
  })
  public async buscarTodosSumarizados() {
    return this.casosService.buscarTodosSumarizado();
  }

  @ApiOperation({
    summary: 'Adicionar palavra-chave',
    description: 'Adiciona uma nova palavra-chave a um caso',
  })
  @Post('/:id/palavras-chave')
  public async adicionarPalavraChave(
    @Param('id') id: number,
    @Body() payload: CriarPalavraChaveApiRequest,
  ) {
    return await this.palavraChaveService.cadastrarNovaPalavraChave(
      id,
      payload.valor,
    );
  }

  @ApiOperation({
    summary: 'Buscar palavra-chave',
    description: 'Busca todas as palavras-chave de um caso',
  })
  @Get('/:id/palavras-chave')
  public async buscarPalavrasChave(@Param('id') id: number) {
    return await this.palavraChaveService.buscar(id);
  }

  @ApiOperation({
    summary: 'Excluir palavra-chave',
    description: 'Exclui uma palavra-chave de um caso',
  })
  @Delete('/:id/palavras-chave/:idPalavraChave')
  public async excluirPalavraChave(
    @Param('id') id: number,
    @Param('idPalavraChave') idPalavraChave: number,
  ) {
    return await this.palavraChaveService.excluirPalavraChave(
      id,
      idPalavraChave,
    );
  }
}
