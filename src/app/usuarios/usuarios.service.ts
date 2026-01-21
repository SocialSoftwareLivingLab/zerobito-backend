import {
  Injectable,
  Logger,
  PreconditionFailedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import {
  CriarUsuarioAdminRequestDto,
  CriarUsuarioComumRequestDto,
} from './dtos/criar-usuario.dto';
import { UsuarioEntity } from './usuarios.entity';
import { Optional } from 'typescript-optional';
import { MensagensHelper } from '@/helpers/mensagens.helper';
import { PerfilUsuario } from './enums/perfil-usuario.enum';
import { PerfisService } from './services/perfis.service';
import AppException from '@/shared/exceptions/app-exception';
import { EnviarEmailRedefinicaoSenhaUsecase } from './usecase';
import { CriptografiaHelper } from '@/helpers/criptografia.helper';
import { TokenRedefinicaoSenhaEntity } from './token-redefinicao.entity';
import UsuarioPerfilEntity from '../usuario-perfil/entities/usuario-perfil.entity';
import { UsuarioPerfilService } from '../usuario-perfil/entities/usuario-perfil.service';
@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);
  private readonly loggera = new Logger();

  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
    private readonly perfisService: PerfisService,
    private readonly usuarioPerfilService: UsuarioPerfilService,

    @InjectRepository(TokenRedefinicaoSenhaEntity)
    private readonly tokenRepository: Repository<TokenRedefinicaoSenhaEntity>,
    
    private readonly enviarEmailRedefinicaoSenhaUsecase: EnviarEmailRedefinicaoSenhaUsecase,
  ) {}

  public async adicionar(
    body: CriarUsuarioComumRequestDto | CriarUsuarioAdminRequestDto,
    perfil: PerfilUsuario = PerfilUsuario.USER,
  ): Promise<UsuarioEntity> {
    this.logger.log(`Adicionando usuário ${body}`);
    const usuarioJaRegistrado = await this.buscarUsuario({ email: body.email });

    if (usuarioJaRegistrado.isPresent()) {
      throw new PreconditionFailedException(
        MensagensHelper.Usuario.USUARIO_JA_CADASTRADO,
      );
    }

    const perfilResult = await this.perfisService.buscarPerfilPorCodigo(perfil);
    const perfilEntity = perfilResult.orElseThrow(
      () => new AppException(MensagensHelper.Usuario.PERFIL_NAO_ENCONTRADO),
    );

    const usuario = this.usuarioRepository.create({
      ...body,
    });

    const user = await this.usuarioRepository.save(usuario)

    await this.usuarioPerfilService.criarPerfilUsuario(
      usuario.id,
      perfilEntity.id
    )

    return user;
  }

  public async buscarUsuario(
    options:
      | FindOptionsWhere<UsuarioEntity>
      | FindOptionsWhere<UsuarioEntity>[],
  ): Promise<Optional<UsuarioEntity>> {
    const usuario = await this.usuarioRepository.findOne({
    where: options
  });

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
