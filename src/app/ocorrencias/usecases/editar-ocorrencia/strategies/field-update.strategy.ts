import { OcorrenciaEntity } from '../../../entities/ocorrencias.entity';
import { CondicaoVitimaEntity } from '../../../entities/vitima/condicao-vitima.entity';
import { Repository } from 'typeorm';

export abstract class EditarCampoStrategy {
  abstract podeLidar(nomeCampo: string): boolean;
  abstract editar(
    entity: OcorrenciaEntity,
    nomeCampo: string,
    valor: any,
    repositories?: DependenciasRepository,
  ): Promise<void>;
}

export interface DependenciasRepository {
  condicaoVitimaRepository: Repository<CondicaoVitimaEntity>;
}

export class CampoSimplesStrategy extends EditarCampoStrategy {
  constructor(private camposSuportados: string[]) {
    super();
  }

  podeLidar(nomeCampo: string): boolean {
    return this.camposSuportados.includes(nomeCampo);
  }

  async editar(entity: OcorrenciaEntity, nomeCampo: string, valor: any): Promise<void> {
    entity[nomeCampo] = valor;
  }
}

export class MergeObjetoStrategy extends EditarCampoStrategy {
  constructor(private camposSuportados: string[]) {
    super();
  }

  podeLidar(nomeCampo: string): boolean {
    return this.camposSuportados.includes(nomeCampo);
  }

  async editar(entity: OcorrenciaEntity, nomeCampo: string, valor: any): Promise<void> {
    if (entity[nomeCampo] && typeof entity[nomeCampo] === 'object') {
      Object.assign(entity[nomeCampo], valor);
    } else {
      entity[nomeCampo] = valor;
    }
  }
}

export class VitimaStrategy extends EditarCampoStrategy {
  podeLidar(nomeCampo: string): boolean {
    return nomeCampo === 'vitima';
  }

  async editar(
    entity: OcorrenciaEntity,
    nomeCampo: string,
    valor: any,
    repositories: DependenciasRepository,
  ): Promise<void> {
    if (valor.numero !== undefined) {
      entity.vitima.numero = String(valor.numero);
    }

    if (valor.nome !== undefined) {
      entity.vitima.nome = valor.nome;
    }

    if (valor.vinculo !== undefined) {
      entity.vitima.vinculo = valor.vinculo;
    }

    if (valor.condicao !== undefined) {
      const novaCondicao = await repositories.condicaoVitimaRepository.findOneBy({
        sigla: valor.condicao,
      });
      
      if (novaCondicao) {
        entity.vitima.condicao = novaCondicao;
      }
    }
  }
}