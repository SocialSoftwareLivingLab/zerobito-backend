import { Module } from '@nestjs/common';
import { CasosGrupoTrabalhoService } from './casos-grupo-trabalho.service';

@Module({
  providers: [CasosGrupoTrabalhoService]
})
export class CasosGrupoTrabalhoModule {}
