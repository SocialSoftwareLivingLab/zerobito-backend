import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuarios.entity';
import { TokenRedefinicaoSenhaEntity } from './token-redefinicao.entity';
import { EnviarEmailRedefinicaoSenhaUsecase } from './usecase';
import { EmailModule } from '@/shared/email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity, TokenRedefinicaoSenhaEntity]), EmailModule],
  controllers: [UsuariosController],
  providers: [UsuariosService, EnviarEmailRedefinicaoSenhaUsecase],
  exports: [UsuariosService],
})
export class UsuariosModule {}
