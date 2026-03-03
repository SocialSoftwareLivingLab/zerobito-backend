import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArquivoEntity } from './entities/arquivo.entity';
import { ArquivoVinculoEntity } from './entities/arquivo.vinculo.entity';
import { ArquivoService, ArquivoVinculoService } from './services/arquivo.service';
import { LocalStorageService } from './services/local-storage.service';
import { STORAGE_SERVICE } from './interfaces/storafe.constant';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArquivoEntity,
      ArquivoVinculoEntity,
    ]),
  ],
  providers: [
    ArquivoService,
    ArquivoVinculoService,
    {
        provide: STORAGE_SERVICE,
        useClass: LocalStorageService
    }
  ],
  exports: [
    ArquivoService,
    ArquivoVinculoService,
    STORAGE_SERVICE
  ],
})
export class ArquivoModule {}