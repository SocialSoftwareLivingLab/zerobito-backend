import { Injectable } from '@nestjs/common';
import AgendarReuniaoUsecase from './usecases/agendar-reuniao/agendar-reuniao.usecase';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';

@Injectable()
export class CasosPlanejamentoService {

  constructor(
    private readonly agendarReuniaoUsecase: AgendarReuniaoUsecase
  ) {
  }


  public async agendarReuniaoPlanejamento(data: Date, idCaso: number, usuarioAutenticado: UsuarioAutenticadoDto) {
    await this.agendarReuniaoUsecase.executar({
      dataAgendamento: data,
      idCaso,
      solicitante: usuarioAutenticado
    })
  }
}
