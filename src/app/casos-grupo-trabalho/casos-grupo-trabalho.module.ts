import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasosGrupoTrabalhoService } from './casos-grupo-trabalho.service';
import MembroGrupoTrabalhoEntity from './entities/membro-grupo.entity';
import StatusMembroGrupoTrabalhoEntity from './entities/status-membro.entity';
import StatusMembroGrupoTrabalhoSeed from './seeds/status-membro-grupo.seed';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MembroGrupoTrabalhoEntity,
      StatusMembroGrupoTrabalhoEntity,
    ]),
  ],
  providers: [CasosGrupoTrabalhoService, StatusMembroGrupoTrabalhoSeed],
  exports: [StatusMembroGrupoTrabalhoSeed]
})
export class CasosGrupoTrabalhoModule {}
