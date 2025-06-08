import { UsuarioEntity } from '@/app/usuarios/usuarios.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Optional } from 'typescript-optional';
import { BuscarCoordenadorInput } from './buscar-coordenador.dtos';

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
      },
      select: ['id', 'nome', 'email', 'dataCriacao'],
      take: 20,
    });

    return result;
  }

  public async buscarPorId(id: number) {
    const result = await this.usuarioRepository.findOneBy({
      id,
    });

    return Optional.ofNullable(result);
  }
}
