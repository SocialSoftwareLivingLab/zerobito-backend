import { Injectable } from '@nestjs/common';
import { ConsultarCoordenadoresFiltroDto } from './dtos/consultar-coordenadores-filtro.dto';
import { ILike, Repository } from 'typeorm';
import { UsuarioEntity } from '../usuarios/usuarios.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PerfilUsuario } from '../usuarios/enums/perfil-usuario.enum';

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
}
