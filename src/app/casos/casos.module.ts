import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoordenadoresModule } from '../coordenadores/coordenadores.module';
import { OcorrenciaEntity } from '../ocorrencias/entities/ocorrencias.entity';
import { OcorrenciasModule } from '../ocorrencias/ocorrencias.module';
import { CasosController } from './casos.controller';
import CasoEntity from './entities/caso.entity';
import CausaEntity from './entities/info-basicas/causa.entity';
import DiagnosticoEntity from './entities/info-basicas/diagnostico.entity';
import PalavraChaveEntity from './entities/palavra-chave.entity';
import CausaSeeds from './seeds/causas.seed';
import DiagnosticosSeeds from './seeds/diagnosticos.seed';
import { CasosService } from './services/casos.service';
import { PalavraChaveService } from './services/palavra-chave.service';
import { AdicionarOcorrenciaAoCasoUseCase } from './usecases/caso/adicionar-ocorrencia/adicionar-ocorrencia.usecase';
import AtualizarInformacoesBasicasCasoUsecase from './usecases/caso/atualizar-informacoes-basicas/atualizar-informacoes-basicas.usecase';
import AtualizarLocalizacaoCasoUsecase from './usecases/caso/atualizar-localizacao/atualizar-localizacao';
import ConsultarCasoPorIdUsecase from './usecases/caso/consultar-casos/consultar-caso-by-id.usecase';
import { ConsultarCasoUseCase } from './usecases/caso/consultar-casos/consultar-caso.usecase';
import ConsultarOcorrenciasUsecase from './usecases/caso/ocorrencia/consultar-ocorrencias-usecase';
import { RegistrarCasoUseCase } from './usecases/caso/registrar-caso/registrar-caso.usecase';
import ConsultarCausaUsecase from './usecases/causa/consultar-causa/consultar-causa.usecase';
import ConsultarDiagnosticoUsecase from './usecases/diagnostico/consultar-diagnostico/consultar-diagnostico.usecase';
import { AdicionarPalavraChaveUseCase } from './usecases/palavra-chave/adicionar-palavra-chave/adicionar-palavra-chave.usecase';
import { BuscarPalavrasChaveUsecase } from './usecases/palavra-chave/buscar-palavras-chave/buscar-palavras-chave.usecase';
import { ExcluirPalavraChaveUsecase } from './usecases/palavra-chave/excluir-palavra-chave/excluir-palavra-chave.usecase';
import AtualizarDataObitoCasoUsecase from './usecases/caso/atualizar-data-obito/atualizar-data-obito.usecase';
import AtualizarDataCasoUsecase from './usecases/caso/atualizar-data/atualizar-data.usecase';
import AtualizarStatusCasoUsecase from './usecases/caso/atualizar-status/atualizar-status.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CasoEntity,
      PalavraChaveEntity,
      CausaEntity,
      DiagnosticoEntity,
      OcorrenciaEntity,
    ]),
    CoordenadoresModule,
    forwardRef(() => OcorrenciasModule),
  ],
  providers: [
    CausaSeeds,
    DiagnosticosSeeds,
    CasosService,
    PalavraChaveService,
    RegistrarCasoUseCase,
    AdicionarOcorrenciaAoCasoUseCase,
    ConsultarCasoUseCase,
    ConsultarCasoPorIdUsecase,
    AdicionarPalavraChaveUseCase,
    BuscarPalavrasChaveUsecase,
    ExcluirPalavraChaveUsecase,
    AtualizarInformacoesBasicasCasoUsecase,
    AtualizarLocalizacaoCasoUsecase,
    ConsultarCausaUsecase,
    ConsultarDiagnosticoUsecase,
    ConsultarOcorrenciasUsecase,
    AtualizarDataObitoCasoUsecase,
    AtualizarDataCasoUsecase,
    AtualizarStatusCasoUsecase,
  ],
  exports: [
    CasosService,
    CausaSeeds,
    DiagnosticosSeeds,
    ConsultarCasoPorIdUsecase,
  ],
  controllers: [CasosController],
})
export class CasosModule {}
