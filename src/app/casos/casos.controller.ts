import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CasosService } from './services/casos.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CriarPalavraChaveApiRequest } from './payloads/palavra-chave/criar-palavra-chave.payload';
import { PalavraChaveService } from './services/palavra-chave.service';
import { CasoResponse } from './payloads/caso/caso.payload';
import { Protegido } from '@/auth/decorators/protegido.decorator';
import { EditarInformacoesBasicasRequest } from './payloads/caso/informacoes-basicas.payload';
import { DiagnosticoApiResponse } from './payloads/caso/diagnostico.payload';
import { CausaApiResponse } from './payloads/caso/causa.payload';
import { EditarLocalizacaoRequest } from './payloads/caso/localizacao.payload';

@Protegido()
@ApiBearerAuth()
@ApiTags('Casos')
@Controller('/api/v1/casos')
export class CasosController {
  constructor(
    private readonly casosService: CasosService,
    private readonly palavraChaveService: PalavraChaveService,
  ) {}

  @ApiOperation({
    summary: 'Buscar todas as causas',
    description: 'Retorna a listagem atual de causas',
  })
  @ApiOkResponse({
    description: 'Causa disponível para uso em vinculação de casos',
    type: CausaApiResponse,
    isArray: true,
  })
  @Get('/causas')
  public async buscarTodasCausas() {
    return this.casosService.listarTodasAsCausas();
  }

  @ApiOperation({
    summary: 'Buscar todas as causas',
    description: 'Retorna a listagem atual de causas',
  })
  @ApiOkResponse({
    description: 'Diagnóstico disponível para uso em vinculações de caso',
    type: DiagnosticoApiResponse,
    isArray: true,
  })
  @Get('/diagnosticos')
  public async buscarTodosDiagnosticos() {
    return this.casosService.listarTodosDiagnosticos();
  }

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
    summary: 'Buscar caso específico',
    description: 'Retorna um caso específico',
  })
  @ApiOkResponse({
    description: 'Caso encontrado',
    type: CasoResponse,
  })
  @Get('/:id')
  public async buscarCasoEspecifico(@Param('id') id: number) {
    return this.casosService.buscarCasoEspecifico(id);
  }

  @ApiOperation({
    summary: 'Editar informações básicas',
    description: 'Edita informações básicas de um caso',
  })
  @Put('/:id/informacoes-basicas')
  public async editarInformacoesBasicas(
    @Param('id') id: number,
    @Body() payload: EditarInformacoesBasicasRequest,
  ) {
    await this.casosService.editarInformacoesBasicas(id, payload);
  }

  @ApiOperation({
    summary: 'Editar localização',
    description: 'Edita a localização de um caso',
  })
  @Put('/:id/localizacao')
  public async editarLocalizacao(
    @Param('id') id: number,
    @Body() payload: EditarLocalizacaoRequest,
  ) {
    await this.casosService.editarLocalizacao(id, payload);
  }

  @ApiOperation({
    summary: 'Buscar localização do caso',
    description: 'Busca as informações sobre a localização do caso',
  })
  @Get('/:id/localizacao')
  public async buscarDadosLocalizacao(@Param('id') id: number) {
    await this.casosService.buscarLocalizacao(id);
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

  @ApiOperation({
    summary: 'Buscar ocorrências',
    description: 'Busca todas ocorrências de um caso'
  })
  @Get('/:id/ocorrencias')
  public async listarOcorrenciasCaso(@Param('id') id: number) {
    return await this.casosService.listarOcorrenciasCaso(id);
  }
}
