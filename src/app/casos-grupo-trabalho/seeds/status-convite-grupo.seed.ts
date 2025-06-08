import SeedRunner from '@/shared/seeds/seed-runner';
import { Seed } from '@/shared/seeds/seed.decorator';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import StatusConviteGrupoTrabalhoEntity from '../entities/convite/status-convite-membro.entity';

interface StatusType {
  codigo: string;
  nome: string;
  descricao: string;
}

const status: StatusType[] = [
  {
    codigo: 'PENDENTE',
    nome: 'Pendente',
    descricao: 'Convite ativo e pendente para o membro convidado',
  },
  {
    codigo: 'ACEITADO',
    nome: 'Aceito',
    descricao:
      'Membro aceitou participar do grupo de trabalho. Convite não pode ser mais utilizado.',
  },
  {
    codigo: 'RECUSADO',
    nome: 'Recusado',
    descricao:
      'Membro recusou participar do grupo de trabalho. Convite não pode ser mais utilizado.',
  },
];

@Seed()
@Injectable()
export default class StatusConviteGrupoTrabalhoSeed implements SeedRunner {
  private readonly logger = new Logger(StatusConviteGrupoTrabalhoSeed.name);

  constructor(
    @InjectRepository(StatusConviteGrupoTrabalhoEntity)
    private readonly statusConviteGrupoRepository: Repository<StatusConviteGrupoTrabalhoEntity>,
  ) {}

  public async run() {
    this.seedStatus();
    this.logger.log("Seed da tabela 'caso_grupo_trabalho_convite_status'...");
  }

  private async seedStatus() {
    const quantidade = await this.statusConviteGrupoRepository.count();

    if (quantidade > 0) return;

    this.logger.log(
      'Criando primeira listagem de status para os convites do grupo de trabalho',
    );

    for (const statusMapeado of status) {
      const statusEntity = this.statusConviteGrupoRepository.create();
      statusEntity.codigo = statusMapeado.codigo;
      statusEntity.nome = statusMapeado.nome;
      statusEntity.descricao = statusMapeado.descricao;

      await this.statusConviteGrupoRepository.save(statusEntity);
    }
  }
}
