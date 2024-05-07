import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoordenadoresModule } from '../coordenadores/coordenadores.module';
import { CasosController } from './casos.controller';
import { CasosService } from './casos.service';
import CasoEntity from './entities/caso.entity';
import { RegistrarCasoUseCase } from './usecases/registrar-caso/registrar-caso.usecase';
import { AdicionarOcorrenciaAoCasoUseCase } from './usecases/adicionar-ocorrencia/adicionar-ocorrencia.usecase';
import { ConsultarCasoUseCase } from './usecases/consultar-casos/consultar-caso.usecase';
import { PalavraChaveService } from './palavra-chave.service';
import { AdicionarPalavraChaveUseCase } from './usecases/adicionar-palavra-chave/adicionar-palavra-chave.usecase';
import { BuscarPalavrasChaveUsecase } from './usecases/buscar-palavras-chave/buscar-palavras-chave.usecase';
import { ExcluirPalavraChaveUsecase } from './usecases/excluir-palavra-chave/excluir-palavra-chave.usecase';
import PalavraChaveEntity from './entities/palavra-chave.entity';
import ConsultarCasoPorIdUsecase from './usecases/consultar-casos/consultar-caso-by-id.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([CasoEntity, PalavraChaveEntity]),
    CoordenadoresModule,
  ],
  providers: [
    CasosService,
    PalavraChaveService,
    RegistrarCasoUseCase,
    AdicionarOcorrenciaAoCasoUseCase,
    ConsultarCasoUseCase,
    ConsultarCasoPorIdUsecase,
    AdicionarPalavraChaveUseCase,
    BuscarPalavrasChaveUsecase,
    ExcluirPalavraChaveUsecase,
  ],
  exports: [CasosService],
  controllers: [CasosController],
})
export class CasosModule {}
