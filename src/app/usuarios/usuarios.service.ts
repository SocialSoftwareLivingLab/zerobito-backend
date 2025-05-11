import {
  Injectable,
  Logger,
  PreconditionFailedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CriarUsuarioRequestDto } from './dtos/criar-usuario.dto';
import { UsuarioEntity } from './usuarios.entity';
import { Optional } from 'typescript-optional';
import { MensagensHelper } from '@/helpers/mensagens.helper';
import { PerfilUsuario } from './enums/perfil-usuario.enum';
import { EnviarEmailRedefinicaoSenhaUsecase } from './usecase';
import { CriptografiaHelper } from '@/helpers/criptografia.helper';
import { TokenRedefinicaoSenhaEntity } from './token-redefinicao.entity';

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);

  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,

    @InjectRepository(TokenRedefinicaoSenhaEntity)
    private readonly tokenRepository: Repository<TokenRedefinicaoSenhaEntity>,
    
    private readonly enviarEmailRedefinicaoSenhaUsecase: EnviarEmailRedefinicaoSenhaUsecase,
  ) {}

  public async adicionar(
    body: CriarUsuarioRequestDto,
    perfil: PerfilUsuario = PerfilUsuario.USER,
  ): Promise<UsuarioEntity> {
    this.logger.log(`Adicionando usuário ${body}`);
    const usuarioJaRegistrado = await this.buscarUsuario({ email: body.email });

    if (usuarioJaRegistrado.isPresent()) {
      throw new PreconditionFailedException(
        MensagensHelper.Usuario.USUARIO_JA_CADASTRADO,
      );
    }

    const usuario = this.usuarioRepository.create({
      ...body,
      permissao: perfil,
    });

    return await this.usuarioRepository.save(usuario);
  }

  public async buscarUsuario(
    options:
      | FindOptionsWhere<UsuarioEntity>
      | FindOptionsWhere<UsuarioEntity>[],
  ): Promise<Optional<UsuarioEntity>> {
    const usuario = await this.usuarioRepository.findOneBy(options);

    return Optional.ofNullable(usuario);
  }

  public async enviarEmailRedefinicaoSenha(email: string): Promise<void> {
    await this.enviarEmailRedefinicaoSenhaUsecase.enviarEmail({ email });
  }

  public async redefinirSenha(token: string, novaSenha: string): Promise<boolean> {
    const tokenEntidade = await this.tokenRepository.findOne({
      where: { token },
      relations: ['usuario'],
    });

    if (!tokenEntidade || tokenEntidade.expiracao < new Date()) {
      throw new PreconditionFailedException(
        MensagensHelper.Token.TOKEN_INVALIDO,
      );
    }

    const usuario = tokenEntidade.usuario;
    usuario.senha = CriptografiaHelper.gerarHash(novaSenha);

    await this.usuarioRepository.save(usuario);
    await this.tokenRepository.delete({ id: tokenEntidade.id });

    return true;
  }
}
