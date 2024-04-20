import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Optional } from 'typescript-optional';
import { PerfilUsuario } from '../usuarios/enums/perfil-usuario.enum';
import { UsuarioEntity } from '../usuarios/usuarios.entity';
import { ConsultarCoordenadoresFiltroDto } from './dtos/consultar-coordenadores-filtro.dto';

@Injectable()
export class CoordenadoresService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  public async buscarCoordenadores({ nome }: ConsultarCoordenadoresFiltroDto) {
    return this.usuarioRepository.find({
      where: {
        nome: ILike(`%${nome || ''}%`),
        permissao: PerfilUsuario.COORDENADOR,
      },
      select: ['id', 'nome', 'email', 'dataCriacao'],
      take: 20,
    });
  }

  public async buscarCoordenadorPorId(
    id: number,
  ): Promise<Optional<UsuarioEntity>> {
    const result = await this.usuarioRepository.findOneBy({
      id,
      permissao: PerfilUsuario.COORDENADOR,
    });

    return Optional.ofNullable(result);
  }
}
