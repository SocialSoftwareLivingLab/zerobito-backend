import { Controller, Get } from '@nestjs/common';
import { CasosService } from './casos.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Casos')
@Controller('/api/v1/casos')
export class CasosController {
  constructor(private readonly casosService: CasosService) {}

  @ApiOperation({
    summary: 'Buscar todos os casos sumarizados',
    description:
      'Retorna a listagem atual de casos sem paginação e com dados básicos',
  })
  @Get()
  public async buscarTodosSumarizados() {
    return this.casosService.buscarTodosSumarizado();
  }
}
