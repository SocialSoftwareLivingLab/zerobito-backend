import { Injectable } from '@nestjs/common';
import AgendarReuniaoUsecase from './usecases/agendar-reuniao/agendar-reuniao.usecase';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import BuscarAgendamentosReuniaoPlanejamentoUseCase from './usecases/buscar-agendamentos/buscar-agendamentos.usecase';
import { ReuniaoAgendadaResponse } from './payloads/reuniao-agendada.payload';

@Injectable()
export class CasosPlanejamentoService {

  constructor(
    private readonly agendarReuniaoUsecase: AgendarReuniaoUsecase,
    private readonly buscarAgendamentosUsecase: BuscarAgendamentosReuniaoPlanejamentoUseCase,
  ) {
  }


  public async agendarReuniaoPlanejamento(data: Date, idCaso: number, usuarioAutenticado: UsuarioAutenticadoDto) {
    await this.agendarReuniaoUsecase.executar({
      dataAgendamento: data,
      idCaso,
      solicitante: usuarioAutenticado
    })
  }

  public async buscarAgendamentos(idCaso: number): Promise<ReuniaoAgendadaResponse[]> {
    const reunioesAgendadas = await this.buscarAgendamentosUsecase.buscarTodos({ idCaso });

    return reunioesAgendadas.map(reuniao => {
      const reuniaoPayloadResponse = new ReuniaoAgendadaResponse();
      reuniaoPayloadResponse.id = reuniao.id;
      reuniaoPayloadResponse.dataReuniao = reuniao.data;
      reuniaoPayloadResponse.dataCriacao = reuniao.dataCriacao;

      reuniaoPayloadResponse.solicitante = {
        nome: reuniao.solicitante.nome,
        email: reuniao.solicitante.email,
      }

      return reuniaoPayloadResponse;
    })
  }
}
