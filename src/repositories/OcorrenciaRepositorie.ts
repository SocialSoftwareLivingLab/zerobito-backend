import { EntityRepository, Repository } from 'typeorm';
import {Ocorrencia} from '../entities/Ocorrencia';

@EntityRepository(Ocorrencia)
class OcorrenciaRepository extends Repository<Ocorrencia> {}


export default OcorrenciaRepository;