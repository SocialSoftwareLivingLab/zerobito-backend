import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import AtaReuniaoEntity from '../../../casos/entities/ata-reuniao/ata-reuniao.entity';
import AgendamentoReuniaoEntity from '@/app/casos-planejamento/entities/agendamento-reuniao.entity';

export interface ObterAtaReuniaoRequest {
  idCaso: number;
  dataReuniao: string;
}

@Injectable()
export default class ObterAtaReuniaoUseCase {
  private readonly logger = new Logger(ObterAtaReuniaoUseCase.name);

  constructor(
    @InjectRepository(AtaReuniaoEntity)
    private readonly ataReuniaoRepository: Repository<AtaReuniaoEntity>,

    @InjectRepository(AgendamentoReuniaoEntity)
    private readonly reuniaoRepository: Repository<AgendamentoReuniaoEntity>,
  ) {}

  public async executar({ idCaso, dataReuniao }: ObterAtaReuniaoRequest): Promise<string> {
    this.logger.log(`Iniciando execução para obter ata - Caso ID: ${idCaso}, Data: ${dataReuniao}`);

    try {
      // 1️⃣ Procurar a reunião pelo caso e data
      const reuniao = await this.reuniaoRepository.findOne({
        where: {
          caso: { id: idCaso },
          data: new Date(dataReuniao),
        },
      });

      if (!reuniao) {
        this.logger.warn(`Nenhuma reunião encontrada para o caso ${idCaso} na data ${dataReuniao}`);
        return '';
      }

      this.logger.log(`Reunião encontrada com ID: ${reuniao.id}`);

      // 2️⃣ Procurar se existe uma ata vinculada
      const ata = await this.ataReuniaoRepository.findOne({
        where: { reuniao: { id: reuniao.id } },
      });

      if (!ata) {
        this.logger.warn(`Nenhuma ata encontrada para a reunião ID: ${reuniao.id}`);
      } else {
        this.logger.log(ata.conteudo);
      }

      // 3️⃣ Retorna o conteúdo da ata ou string vazia
      return ata?.conteudo || '';
    } catch (error) {
      this.logger.error(`Erro ao obter a ata para caso ${idCaso}, data ${dataReuniao}`, error.stack);
      throw error;
    }
  }
}

