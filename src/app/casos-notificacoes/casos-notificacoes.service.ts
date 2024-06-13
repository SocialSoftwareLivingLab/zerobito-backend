import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import TipoNotificacaoEntity from './entities/notificacao-tipo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoNotificacaoResponse } from './payloads/tipo-notificacao.payload';

@Injectable()
export class CasosNotificacoesService {
  constructor(
    @InjectRepository(TipoNotificacaoEntity)
    private readonly tipoNotificacaoRepository: Repository<TipoNotificacaoEntity>,
  ) {}

  async buscarTiposNotificacoes(): Promise<TipoNotificacaoResponse[]> {
    const resultado = await this.tipoNotificacaoRepository.find({});

    return resultado.map((tipo) => {
      return {
        id: tipo.id,
        nome: tipo.nome,
        descricao: tipo.descricao,
      };
    });
  }
}
