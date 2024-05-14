import { InjectRepository } from '@nestjs/typeorm';
import CausaEntity from '../entities/info-basicas/causa.entity';
import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import SeedRunner from '@/shared/seeds/seed-runner';

const causas = [
  { sigla: 'AGENTES_FISICOS', descricao: 'AG FÍSICOS (CALOR, RUÍDO, RAD)' },
  { sigla: 'AGENTES_BIOLoGICOS', descricao: 'AGENTES BIOLÓGICOS' },
  { sigla: 'AGENTES_QUIMICOS', descricao: 'AGENTES QUIMICOS' },
  {
    sigla: 'ANIMAIS_PLANTAS_VENENOSAS',
    descricao: 'ANIMAIS/PLANTAS VENENOSOS',
  },
  { sigla: 'CORPO_ESTRANHO', descricao: 'CORPO ESTRANHO' },
  { sigla: 'CORRENTE_ELETRICA', descricao: 'CORRENTE ELÉTRICA' },
  { sigla: 'ESFORCOS_PESO', descricao: 'ESFORÇOS/PESO' },
  { sigla: 'EXPLOSAO_INCÊNDIO_FOGO', descricao: 'EXPLOSÃO/INCÊNDIO/FOGO' },
  { sigla: 'MAQUINAS_EQUIPAMENTOS', descricao: 'MÁQUINAS/EQUIPAMENTOS' },
  { sigla: 'MOTOCICLETA', descricao: 'MOTOCICLETA' },
  { sigla: 'MOVIMENTAÇAO_CARGA', descricao: 'MOVIMENTAÇÃO DE CARGA' },
  { sigla: 'QUEDA_ALTURA', descricao: 'QUEDA DE ALTURA' },
  { sigla: 'QUEDA_OBJETOS', descricao: 'QUEDA DE OBJETOS' },
  { sigla: 'QUEDA_MESMO_NIVEL', descricao: 'QUEDA DO MESMO NIVEL' },
  { sigla: 'SUBSTANCIAS_QUENTES', descricao: 'SUBSTÂNCIAS QUENTES' },
  { sigla: 'SOTERRAMENTO', descricao: 'SOTERRAMENTO' },
  { sigla: 'VEICULO_TRANSPORTE', descricao: 'VEÍCULO DE TRANSPORTE' },
  { sigla: 'OUTROS', descricao: 'OUTROS' },
  { sigla: 'INDEFINIDO', descricao: 'INDEFINIDO' },
];

@Injectable()
export default class CausaSeeds implements SeedRunner {
  private readonly logger = new Logger(CausaSeeds.name);

  constructor(
    @InjectRepository(CausaEntity)
    private readonly causaRepository: Repository<CausaEntity>,
  ) {}

  public async run() {
    this.seedCausas();
    this.logger.log("Seed da tabela 'caso_causa'...");
  }

  private async seedCausas() {
    const quantidade = await this.causaRepository.count();
    if (quantidade > 0) return;

    for (const causaMapeada of causas) {
      const causaEntity = this.causaRepository.create();
      causaEntity.codigo = causaMapeada.sigla;
      causaEntity.descricao = causaMapeada.descricao;
      causaEntity.dataCriacao = new Date();
      causaEntity.nome = causaMapeada.descricao;

      await this.causaRepository.save(causaEntity);
    }
  }
}
