import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import CasoEntity from '@/app/casos/entities/caso.entity';
import RelatorioFinalizacaoEntity from './entities/relatorio-finalizacao.entity';
import AtorRelatorioFinalizacaoEntity from './entities/ator-relatorio-finalizacao.entity';
import ComentarioAtorRelatorioEntity from './entities/comentario-ator-relatorio.entity';
import UsuarioPerfilEntity from '@/app/usuario-perfil/entities/usuario-perfil.entity';
import { CasoFinalizacaoController } from './caso-finalizacao.controller';
import { CasoFinalizacaoService } from './services/caso-finalizacao.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RelatorioFinalizacaoEntity,
      AtorRelatorioFinalizacaoEntity,
      ComentarioAtorRelatorioEntity,
      UsuarioPerfilEntity,
      CasoEntity,
    ]),
  ],
  controllers: [CasoFinalizacaoController],
  providers: [CasoFinalizacaoService],
  exports: [CasoFinalizacaoService],
})
export class CasoFinalizacaoModule {}
