import { PerfilUsuario } from '@/app/usuarios/enums/perfil-usuario.enum';
import { UsuarioEntity } from '@/app/usuarios/usuarios.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Optional } from 'typescript-optional';
import {
  BuscarCoordenadorInput,
  BuscarCoordenadorOutput,
} from './buscar-coordenador.dtos';

@Injectable()
export class BuscarCoordenadorUseCase {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  public async buscarPorFiltro({ nome }: BuscarCoordenadorInput) {
    const result = await this.usuarioRepository.find({
      where: {
        nome: ILike(`%${nome || ''}%`),
        permissao: PerfilUsuario.COORDENADOR,
      },
      select: ['id', 'nome', 'email', 'dataCriacao'],
      take: 20,
    });

    return result.map((coordenador) => this.mapToOutput(coordenador));
  }

  public async buscarPorId(
    id: number,
  ): Promise<Optional<BuscarCoordenadorOutput>> {
    const result = await this.usuarioRepository.findOneBy({
      id,
      permissao: PerfilUsuario.COORDENADOR,
    });

    return Optional.ofNullable(result).map((coordenador) =>
      this.mapToOutput(coordenador),
    );
  }

  private mapToOutput(coordenador: UsuarioEntity): BuscarCoordenadorOutput {
    return {
      id: coordenador.id,
      nome: coordenador.nome,
      email: coordenador.email,
      dataCriacao: coordenador.dataCriacao,
    };
  }
}
