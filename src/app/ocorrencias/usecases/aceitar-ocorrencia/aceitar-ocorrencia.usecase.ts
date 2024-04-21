import { MensagensHelper } from '@/helpers/mensagens.helper';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StatusOcorrenciaEnum } from '../../enums/status-ocorrencia.enum';
import { BuscarOcorrenciaUseCase } from '../buscar-ocorrencia/buscar-ocorrencia.usecase';
import { TrocarStatusOcorrenciaUseCase } from '../trocar-status-ocorrencia/trocar-status-ocorrencia.usecase';
import { AceitarOcorrenciaInput } from './aceitar-ocorrencia.dto';

@Injectable()
export class AceitarOcorrenciaUseCase {
  constructor(
    private readonly buscarOcorrencia: BuscarOcorrenciaUseCase,
    private readonly trocarStatus: TrocarStatusOcorrenciaUseCase,
  ) {}

  public async aceitar({ id }: AceitarOcorrenciaInput) {
    const resultadoBuscaOcorrencia = await this.buscarOcorrencia.buscar(id);

    const ocorrencia = resultadoBuscaOcorrencia.orElseThrow(
      () =>
        new NotFoundException(
          MensagensHelper.Ocorrencias.OCORRENCIA_NAO_ENCONTRADA,
        ),
    );

    if (ocorrencia.status.sigla !== 'AGUARDANDO_ANALISE') {
      throw new BadRequestException(
        MensagensHelper.Ocorrencias.OCORRENCIA_NAO_PODE_SER_ACEITA,
      );
    }

    await this.trocarStatus.trocar(ocorrencia, StatusOcorrenciaEnum.ACEITO);
  }
}
