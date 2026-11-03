import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import CasoEntity from '@/app/casos/entities/caso.entity';
import RelatorioFinalizacaoEntity from './entities/relatorio-finalizacao.entity';
import AtorRelatorioFinalizacaoEntity from './entities/ator-relatorio-finalizacao.entity';
import ComentarioAtorRelatorioEntity from './entities/comentario-ator-relatorio.entity';
import { UsuarioPerfilModule } from '@/app/usuario-perfil/entities/usuario-perfil.module';
import { CasoFinalizacaoController } from './caso-finalizacao.controller';
import { CasoFinalizacaoService } from './services/caso-finalizacao.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RelatorioFinalizacaoEntity,
      AtorRelatorioFinalizacaoEntity,
      ComentarioAtorRelatorioEntity,
      CasoEntity,
    ]),
    UsuarioPerfilModule,
  ],
  controllers: [CasoFinalizacaoController],
  providers: [CasoFinalizacaoService],
  exports: [CasoFinalizacaoService],
})
export class CasoFinalizacaoModule {}
