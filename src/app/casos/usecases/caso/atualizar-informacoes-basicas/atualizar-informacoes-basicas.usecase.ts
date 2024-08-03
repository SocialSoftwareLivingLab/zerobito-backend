import { MensagensHelper } from '@/helpers/mensagens.helper';
import AppException from '@/shared/exceptions/app-exception';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CasoEntity from '../../../entities/caso.entity';
import ConsultarCausaUsecase from '../../causa/consultar-causa/consultar-causa.usecase';
import ConsultarDiagnosticoUsecase from '../../diagnostico/consultar-diagnostico/consultar-diagnostico.usecase';
import ConsultarCasoPorIdUsecase from '../consultar-casos/consultar-caso-by-id.usecase';

export interface AtualizarInformacoesBasicasCasoUsecaseRequest {
  id: number;
  dados: {
    comentarios: string | null;
    causaPrimaria: string | null;
    causaSecundaria: string | null;
    diagnostico: string | null;
  };
}

@Injectable()
export default class AtualizarInformacoesBasicasCasoUsecase {
  constructor(
    private readonly consultarCausaUsecase: ConsultarCausaUsecase,
    private readonly consultarCasoPorIdUsecase: ConsultarCasoPorIdUsecase,
    private readonly consultarDiagnosticoUsecase: ConsultarDiagnosticoUsecase,
    @InjectRepository(CasoEntity)
    private readonly casoRepository: Repository<CasoEntity>,
  ) {}

  public async executar({
    id,
    dados,
  }: AtualizarInformacoesBasicasCasoUsecaseRequest) {
    const validacaoConsulta =
      await this.consultarCasoPorIdUsecase.buscarPorId(id);

    const caso: CasoEntity = validacaoConsulta.orElseThrow(
      () => new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO),
    );

    const causaPrimaria = await this.consultarCausa(dados.causaPrimaria);
    const causaSecundaria = await this.consultarCausa(dados.causaSecundaria);
    const diagnostico = await this.consultarDiagnostico(dados.diagnostico);

    caso.informacoesBasicas.comentario = dados.comentarios;
    caso.informacoesBasicas.causaPrimaria = causaPrimaria;
    caso.informacoesBasicas.causaSecundaria = causaSecundaria;
    caso.informacoesBasicas.diagnostico = diagnostico;

    await this.casoRepository.save(caso);
  }

  private async consultarCausa(codigo: string | null) {
    if (codigo === null) return undefined;

    const causa = await this.consultarCausaUsecase.consultar(codigo);
    return causa;
  }

  private async consultarDiagnostico(codigo: string | null) {
    if (codigo === null) return undefined;

    const buscarDiagnostico =
      await this.consultarDiagnosticoUsecase.consultar(codigo);

    const diagnostico = buscarDiagnostico.orElseThrow(
      () => new AppException(MensagensHelper.Casos.DIAGNOSTICO_NAO_ENCONTRADO),
    );

    return diagnostico;
  }
}
