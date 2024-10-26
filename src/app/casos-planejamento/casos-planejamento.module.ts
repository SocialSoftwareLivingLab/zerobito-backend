import { Module } from '@nestjs/common';
import { CasosPlanejamentoService } from './casos-planejamento.service';
import { CasosPlanejamentoController } from './casos-planejamento.controller';

@Module({
  providers: [CasosPlanejamentoService],
  controllers: [CasosPlanejamentoController]
})
export class CasosPlanejamentoModule {}
