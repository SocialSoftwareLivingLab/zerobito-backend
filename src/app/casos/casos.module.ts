import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoordenadoresModule } from '../coordenadores/coordenadores.module';
import { CasosController } from './casos.controller';
import { CasosService } from './services/casos.service';
import CasoEntity from './entities/caso.entity';
import { RegistrarCasoUseCase } from './usecases/caso/registrar-caso/registrar-caso.usecase';
import { AdicionarOcorrenciaAoCasoUseCase } from './usecases/caso/adicionar-ocorrencia/adicionar-ocorrencia.usecase';
import { ConsultarCasoUseCase } from './usecases/caso/consultar-casos/consultar-caso.usecase';
import { PalavraChaveService } from './services/palavra-chave.service';
import { AdicionarPalavraChaveUseCase } from './usecases/palavra-chave/adicionar-palavra-chave/adicionar-palavra-chave.usecase';
import { BuscarPalavrasChaveUsecase } from './usecases/palavra-chave/buscar-palavras-chave/buscar-palavras-chave.usecase';
import { ExcluirPalavraChaveUsecase } from './usecases/palavra-chave/excluir-palavra-chave/excluir-palavra-chave.usecase';
import PalavraChaveEntity from './entities/palavra-chave.entity';
import ConsultarCausaUsecase from './usecases/causa/consultar-causa/consultar-causa.usecase';
import AtualizarInformacoesBasicasCasoUsecase from './usecases/caso/atualizar-informacoes-basicas/atualizar-informacoes-basicas.usecase';
import ConsultarCasoPorIdUsecase from './usecases/caso/consultar-casos/consultar-caso-by-id.usecase';
import ConsultarDiagnosticoUsecase from './usecases/diagnostico/consultar-diagnostico/consultar-diagnostico.usecase';
import CausaEntity from './entities/info-basicas/causa.entity';
import DiagnosticoEntity from './entities/info-basicas/diagnostico.entity';
import CausaSeeds from './seeds/causas.seed';
import DiagnosticosSeeds from './seeds/diagnosticos.seed';
import AtualizarLocalizacaoCasoUsecase from './usecases/caso/atualizar-localizacao/atualizar-localizacao';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CasoEntity,
      PalavraChaveEntity,
      CausaEntity,
      DiagnosticoEntity,
    ]),
    CoordenadoresModule,
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
  ],
  exports: [CasosService, CausaSeeds, DiagnosticosSeeds],
  controllers: [CasosController],
})
export class CasosModule {}
