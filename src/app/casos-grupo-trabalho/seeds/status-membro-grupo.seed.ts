import SeedRunner from '@/shared/seeds/seed-runner';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import StatusMembroGrupoTrabalhoEntity from '../entities/status-membro.entity';
import { Seed } from '@/shared/seeds/seed.decorator';

interface StatusType {
  codigo: string;
  nome: string;
  descricao: string;
}

const status: StatusType[] = [
  { codigo: 'AGUARDANDO_ACEITE', nome: 'Aguardando aceite', descricao: 'Membro foi convidado e convite está pendente' },
  { codigo: 'ACEITO', nome: 'Aceito', descricao: 'Membro aceitou fazer parte do grupo de trabalho' },
  { codigo: 'INATIVO', nome: 'Inativo', descricao: 'Membro foi removido do grupo de trabalho' },
];

@Seed()
@Injectable()
export default class StatusMembroGrupoTrabalhoSeed implements SeedRunner {
  private readonly logger = new Logger(StatusMembroGrupoTrabalhoSeed.name);

  constructor(
    @InjectRepository(StatusMembroGrupoTrabalhoEntity)
    private readonly statusMembroGrupoRepository: Repository<StatusMembroGrupoTrabalhoEntity>,
  ) {}

  public async run() {
    this.seedStatus();
    this.logger.log("Seed da tabela 'caso_membro_grupo_trabalho_status'...");
  }

  private async seedStatus() {
    const quantidade = await this.statusMembroGrupoRepository.count();
    
    if (quantidade > 0) return;

    this.logger.log('Criando primeira listagem de status para os membros do grupo de trabalho');

    for (const statusMapeado of status) {
      const statusEntity = this.statusMembroGrupoRepository.create();
      statusEntity.codigo = statusMapeado.codigo;
      statusEntity.descricao = statusMapeado.descricao;
      statusEntity.nome = statusMapeado.descricao;

      await this.statusMembroGrupoRepository.save(statusEntity);
    }
  }
}
