import { Module } from '@nestjs/common';
import { CasosGrupoTrabalhoService } from './casos-grupo-trabalho.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import MembroGrupoTrabalhoEntity from './entities/membro-grupo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MembroGrupoTrabalhoEntity])],
  providers: [CasosGrupoTrabalhoService],
})
export class CasosGrupoTrabalhoModule {}
