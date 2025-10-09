import { Protegido } from "@/auth/decorators/protegido.decorator";
import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
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
        description: 'Tarefas de um membro do grupo disponíveis.',
        type: TarefaResponse,
        isArray: true,
    })
    @Get('/:idCaso/grupo-trabalho/membros/tarefas/:membroGrupoTrabalhoId')
    public async listarTarefas(
        @Param('idCaso') idCaso: number,
        @Param('membroGrupoTrabalhoId') membroGrupoTrabalhoId: number,
    ) {
        const response = await this.casoTarefaService.listarTarefa(idCaso, membroGrupoTrabalhoId);

        return response.tarefas.map((tarefa) => {
            const tarefaResponse = new TarefaResponse();
            tarefaResponse.comentario = tarefa.comentario;
            tarefaResponse.id = tarefa.id;
            tarefaResponse.nome = tarefa.nome;
            tarefaResponse.prazo = tarefa.prazo;
            tarefaResponse.status = tarefa.status;
            return tarefaResponse;
        });
    }

    @ApiOperation({
        summary: 'Listar todas as tarefas de um caso',
        description: 'Retorna uma lista de todas as tarefas associadas a um caso',
    })
    @ApiOkResponse({
        description: 'Tarefas do caso disponíveis.',
        type: TarefaResponse,
        isArray: true,
    })
    @Get('/:idCaso/grupo-trabalho/membros/tarefas')
    public async listarTarefasCaso(
        @Param('idCaso') idCaso: number,
    ) {
        const response = await this.casoTarefaService.listarTarefaCaso(idCaso);

        return response.tarefas.map((tarefa) => {
            const tarefaResponse = new TarefaResponse();
            tarefaResponse.comentario = tarefa.comentario;
            tarefaResponse.id = tarefa.id;
            tarefaResponse.nome = tarefa.nome;
            tarefaResponse.prazo = tarefa.prazo;
            tarefaResponse.status = tarefa.status;
            return tarefaResponse;
        });
    }

    @ApiOperation({
        summary: 'Registrar uma tarefa',
        description: 'Registra uma nova tarefa para um membro do grupo de trabalho',
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
            payload.nomeMembro,
            payload.comentario,
            payload.nome,
            payload.prazo
        );
    }

    @ApiOperation({
        summary: 'Editar uma tarefa existente',
        description: 'Permite atualizar nome, comentário, prazo, status e responsável de uma tarefa existente.',
    })
    @ApiOkResponse({
        description: 'Tarefa editada com sucesso.'
    })
    @Put('/:idCaso/grupo-trabalho/membros/tarefas/editar/:idTarefa')
    public async editarTarefa(
        @Param('idCaso') idCaso: number,
        @Param('idTarefa') idTarefa: number,
        @Body() payload: Partial<RegistrarTarefaRequest> & { statusCodigo?: string } & { statusConclusaoCodigo?: string},
    ) {
        return await this.casoTarefaService.editarTarefa(
            idTarefa,
            payload.nome,
            payload.comentario,
            payload.prazo,
            payload.statusCodigo,
            payload.statusConclusaoCodigo,
            payload.nomeMembro,
            idCaso,
        );
    }
}
