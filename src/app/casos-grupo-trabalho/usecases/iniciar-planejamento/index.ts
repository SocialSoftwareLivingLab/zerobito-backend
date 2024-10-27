import { CasosService } from '@/app/casos/services/casos.service';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import { MensagensHelper } from '@/helpers/mensagens.helper';
import AppException from '@/shared/exceptions/app-exception';
import { Injectable } from '@nestjs/common';
import { StatusCasoEnum } from '@/app/casos/entities/status-caso.enum';

export interface IniciarPlanejamentoUsecaseRequest {
  caso: {
    id: number;
  };
}

@Injectable()
export default class IniciarPlanejamentoUsecase {
  constructor(
    private readonly casoService: CasosService,
  ) {}

  public async IniciarPlanejamento(payload: IniciarPlanejamentoUsecaseRequest) {
    const { caso} = payload;

    const casoInformadoExiste = await this.casoService.buscarCasoEspecifico(
      caso.id,
    );

    if (!casoInformadoExiste) {
      throw new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO);
    }

    if (casoInformadoExiste.status === StatusCasoEnum.EM_PREPARACAO) {
      await this.casoService.atualizarStatus(
        caso.id,
        StatusCasoEnum.EM_PLANEJAMENTO,
      );
    }
  }
}
