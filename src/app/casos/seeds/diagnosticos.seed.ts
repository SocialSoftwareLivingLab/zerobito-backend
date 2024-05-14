import SeedRunner from '@/shared/seeds/seed-runner';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import DiagnosticoEntity from '../entities/info-basicas/diagnostico.entity';

const diagnosticos = [
  { sigla: 'ALERGIAS', descricao: 'ALERGIAS' },
  { sigla: 'AMPUTACAO', descricao: 'AMPUTAÇÃO' },
  { sigla: 'CONTUSAO', descricao: 'CONTUSÃO' },
  { sigla: 'CORPO_ESTRANHO', descricao: 'CORPO ESTRANHO' },
  { sigla: 'DIST_RESPIRATORIO', descricao: 'DIST RESPIRATÓRIO' },
  { sigla: 'ENTORSE', descricao: 'ENTORSE' },
  { sigla: 'ESCORIACOES', descricao: 'ESCORIAÇÕES' },
  { sigla: 'ESMAGAMENTO', descricao: 'ESMAGAMENTO' },
  { sigla: 'FCC', descricao: 'FCC' },
  { sigla: 'FRATURA', descricao: 'FRATURA' },
  { sigla: 'INFECCAO', descricao: 'INFECÇÃO' },
  { sigla: 'INTOX_ENVENENAM', descricao: 'INTOX/ENVENENAM' },
  { sigla: 'LESAO_MEDULAR', descricao: 'LESÃO MEDULAR' },
  { sigla: 'PERFURACAO', descricao: 'PERFURAÇÃO' },
  { sigla: 'POLITRAUMATISMO', descricao: 'POLITRAUMATISMO' },
  { sigla: 'QUEIMADURA', descricao: 'QUEIMADURA' },
  { sigla: 'TCE', descricao: 'TCE' },
  { sigla: 'TRAUMA_VISCERAL', descricao: 'TRAUMA VISCERAL' },
  { sigla: 'OUTROS', descricao: 'OUTROS' },
  { sigla: 'INDEFINIDO', descricao: 'INDEFINIDO' },
];

@Injectable()
export default class DiagnosticosSeeds implements SeedRunner {
  private readonly logger = new Logger(DiagnosticosSeeds.name);

  constructor(
    @InjectRepository(DiagnosticoEntity)
    private readonly diagnosticoRepository: Repository<DiagnosticoEntity>,
  ) {}

  public async run() {
    this.seedDiagnosticos();
    this.logger.log("Seed da tabela 'caso_diagnostico'...");
  }

  private async seedDiagnosticos() {
    const quantidade = await this.diagnosticoRepository.count();
    if (quantidade > 0) return;

    this.logger.log('Criando primeira listagem de diagnosticos');

    for (const diagnosticoMapeado of diagnosticos) {
      const diagnosticoEntity = this.diagnosticoRepository.create();
      diagnosticoEntity.codigo = diagnosticoMapeado.sigla;
      diagnosticoEntity.descricao = diagnosticoMapeado.descricao;
      diagnosticoEntity.dataCriacao = new Date();
      diagnosticoEntity.nome = diagnosticoMapeado.descricao;

      await this.diagnosticoRepository.save(diagnosticoEntity);
    }
  }
}
