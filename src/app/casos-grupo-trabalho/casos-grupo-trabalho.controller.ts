import { Protegido } from '@/auth/decorators/protegido.decorator';
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CasosGrupoTrabalhoService } from './casos-grupo-trabalho.service';
import { MembroGrupoTrabalhoResponse } from './payloads/membro-grupo-trabalho.payload';

@Protegido()
@ApiBearerAuth()
@ApiTags('Grupo de trabalho')
@Controller('/api/v1/casos')
export class CasosGrupoTrabalhoController {
  constructor(
    private readonly casoGrupoTrabalhoService: CasosGrupoTrabalhoService,
  ) {}

  @Get('/{idCaso}/grupo-trabalho/membros')
  public async listarMembrosGrupo(idCaso: number) {
    const response = await this.casoGrupoTrabalhoService.listar(idCaso);

    return response.map(membro => {
      const membroResponse = new MembroGrupoTrabalhoResponse();
      membroResponse.id = membro.id;
      membroResponse.identificador = membro.identificador;
      membroResponse.nome = membro.membro.nome;
      membroResponse.email = membro.membro.email;

      return membroResponse;
    })
  }
}
