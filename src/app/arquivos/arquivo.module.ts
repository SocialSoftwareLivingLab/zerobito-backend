import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArquivoEntity } from './entities/arquivo.entity';
import { ArquivoVinculoEntity } from './entities/arquivo.vinculo.entity';
import { ArquivoService, ArquivoVinculoService } from './services/arquivo.service';
// Para nuvem: importe aqui a nova implementação (ex.: S3StorageService) no lugar de LocalStorageService.
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
        // PONTO DE TROCA: para migrar para nuvem, substitua LocalStorageService
        // pela nova implementação (ex.: useClass: S3StorageService).
        // Nenhum outro arquivo precisa ser alterado.
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