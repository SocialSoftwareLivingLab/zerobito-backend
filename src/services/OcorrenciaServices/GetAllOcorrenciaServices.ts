import { getRepository } from 'typeorm'
import { Ocorrencia } from '../../entities/Ocorrencia'

export class GetAllOcorrenciaService {
    async execute() {
        const repo = getRepository(Ocorrencia)
        const ocorrencia = await repo.find()

        return ocorrencia
    }
}
