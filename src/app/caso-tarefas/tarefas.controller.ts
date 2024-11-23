import { Protegido } from "@/auth/decorators/protegido.decorator";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CasosTarefasService } from "./tarefas.service";
import { RegistrarTarefaRequest, TarefaResponse } from "./payloads/tarefa.payload";

@Protegido()
@ApiBearerAuth()
@ApiTags('Grupo de trabalho')
@Controller('/api/v1/casos')
export class CasosTarefasController {
    constructor(
        private readonly casoTarefaService: CasosTarefasService,
    ) {}

    @ApiOperation({
        summary: 'Listar todas as tarefas para um membro de um grupo de trabalho',
        description: 'Retorna uma lista de tarefas para um membro em determinado grupo de trabalho',
    })
    @ApiOkResponse({
        description: 'Tarefas de um mebro para o grupo disponíveis.',
        type: TarefaResponse,
        isArray: true,
    })
    @Get('/:idCaso/grupo-trabalho/membros/tarefas')
    public async listarTarefas(
        @Param('idCaso')
        idCaso: number,
        @Body() idMembro: number,
    ) {
        const response = await this.casoTarefaService.listarTarefa(idCaso, idMembro);

        return response.tarefas.map((tarefa) => {
            const tarefaResponse = new TarefaResponse();
            tarefaResponse.comentario = tarefa.comentario;
            tarefaResponse.identificador = tarefa.identificador;
            tarefaResponse.nome = tarefa.nome;
            tarefaResponse.prazo = tarefa.prazo;
            tarefaResponse.status = tarefa.status;

            return tarefaResponse;
        });
    }

    @ApiOperation({
        summary: 'Registrar uma tarefa',
        description: 'Registra um pedido de tarefa para um membro do grupo de trabalho',
    })
    @ApiOkResponse({
        description: 'Tarefa registrada com sucesso.'
    })
    @Post('/:idCaso/grupo-trabalho/membros/registrar-tarefa')
    public async registrarTarefa(
        @Param('idCaso') idCaso: number,
        @Body() payload: RegistrarTarefaRequest,
    ) {
        return await this.casoTarefaService.registrarTarefa(
            idCaso,
            payload.membro,
            payload.comentario,
            payload.nome,
            payload.prazo
        );
    }
}