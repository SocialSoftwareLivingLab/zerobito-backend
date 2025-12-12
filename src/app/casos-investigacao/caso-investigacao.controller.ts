import { Protegido } from '@/auth/decorators/protegido.decorator';
import { Body, Controller, Get, Logger, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CasosInvestigacaoService } from './caso-investigacao.service';
import { AlterarMapaEtapaDTO } from './usecases/atualizar-mapa.usecase.ts';
import { Permissao } from '../usuarios/decorators/permissao.decorator';
import { PermissaoEnum } from '../usuarios/enums/permissoes.enum';

@Protegido()
@ApiBearerAuth()
@ApiTags('Casos')
@Controller('/api/v1')
export class CasosInvestigacaoController {
  private readonly logger = new Logger(CasosInvestigacaoController.name);
  constructor(
    private readonly casosInvestigacaoService: CasosInvestigacaoService,
  ) { }

  @ApiOperation({
    summary: 'Altera mapa de investigação',
    description: 'Atualiza status e descrição do mapa em questão.',
  })
  @ApiOkResponse({
    description: 'Mapa atualizado com sucesso.',
  })
  @Permissao(PermissaoEnum.CASOS_ALTERAR_MAPA)
  @Put('/:id/investigacao/mapa/alterar')
  async alterarMapaEtapa(
    @Param('id') idCaso: number,
    @Body() body: AlterarMapaEtapaDTO,
  ) {
    const response = await this.casosInvestigacaoService.alterarMapaEtapa(
      idCaso,
      body.name,
      body.descricao,
      body.novoStatus,
    );

    return response;
  }

  @ApiOperation({
    summary: 'Obter mapa de investigação',
    description: 'Pesquisa pelos mapa etapas de um caso.',
  })
  @Get('/:id/investigacao/mapa/buscar')
  async listarEtapas(@Param('id') idCaso: number) {
    return await this.casosInvestigacaoService.buscarMapaEtapas(idCaso);
  }

}
