import { Injectable } from '@nestjs/common';
import AgendarReuniaoUsecase from './usecases/agendar-reuniao/agendar-reuniao.usecase';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import BuscarReuniaoUseCase from './usecases/buscar-agendamentos/buscar-agendamentos.usecase';

@Injectable()
export class CasosPlanejamentoService {

  constructor(
    private readonly agendarReuniaoUsecase: AgendarReuniaoUsecase,
    private readonly buscarReuniaoUseCase: BuscarReuniaoUseCase
  ) {
  }


  public async agendarReuniaoPlanejamento(data: Date, idCaso: number, usuarioAutenticado: UsuarioAutenticadoDto) {
    await this.agendarReuniaoUsecase.executar({
      dataAgendamento: data,
      idCaso,
      solicitante: usuarioAutenticado
    })
  }

  public async buscarReuniaoPlanejamento(idCaso: number) {
    const reunioes = await this.buscarReuniaoUseCase.buscarTodos({
      idCaso,
    })

    return reunioes;
  }
}
