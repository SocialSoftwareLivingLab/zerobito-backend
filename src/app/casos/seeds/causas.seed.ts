import { InjectRepository } from '@nestjs/typeorm';
import CausaEntity from '../entities/info-basicas/causa.entity';
import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import SeedRunner from '@/shared/seeds/seed-runner';

export default class CausaSeeds implements SeedRunner {
  private readonly logger = new Logger(CausaSeeds.name);

  constructor(
    @InjectRepository(CausaEntity)
    private readonly causaRepository: Repository<CausaEntity>,
  ) {}

  public async run() {
    this.seedCausas();
  }

  private async seedCausas() {
    this.logger.log("Seed da tabela 'caso_causa'...");
  }
}
