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

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);

  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
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
}
