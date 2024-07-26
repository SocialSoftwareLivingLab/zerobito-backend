import { Test, TestingModule } from '@nestjs/testing';
import { CasosGrupoTrabalhoService } from './casos-grupo-trabalho.service';

describe('CasosGrupoTrabalhoService', () => {
  let service: CasosGrupoTrabalhoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CasosGrupoTrabalhoService],
    }).compile();

    service = module.get<CasosGrupoTrabalhoService>(CasosGrupoTrabalhoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
