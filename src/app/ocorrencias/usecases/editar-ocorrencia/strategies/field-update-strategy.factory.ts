import { 
  EditarCampoStrategy, 
  CampoSimplesStrategy, 
  MergeObjetoStrategy, 
  VitimaStrategy 
} from './field-update.strategy';

export class FieldUpdateStrategyFactory {
  private strategies: EditarCampoStrategy[] = [
    new CampoSimplesStrategy(['titulo', 'descricao', 'data']),
    new MergeObjetoStrategy(['local', 'empresa', 'fonte']),
    new VitimaStrategy(),
  ];

  getStrategy(fieldName: string): EditarCampoStrategy | null {
    return this.strategies.find(strategy => strategy.podeLidar(fieldName)) || null;
  }

  getAllSupportedFields(): string[] {
    return ['titulo', 'descricao', 'data', 'local', 'empresa', 'fonte', 'vitima'];
  }
}