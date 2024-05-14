import DiagnosticoEntity from '@/app/casos/entities/info-basicas/diagnostico.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Optional } from 'typescript-optional';

@Injectable()
export default class ConsultarDiagnosticoUsecase {
  constructor(
    @InjectRepository(DiagnosticoEntity)
    private readonly diagnosticoRepository: Repository<DiagnosticoEntity>,
  ) {}

  public async consultar(codigo: string): Promise<Optional<DiagnosticoEntity>> {
    try {
      const response = await this.diagnosticoRepository.findOneBy({
        codigo,
      });

      console.log(response);

      return Optional.ofNullable(response);
    } catch {
      return Optional.empty();
    }
  }
}
