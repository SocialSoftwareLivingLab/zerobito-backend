import { getRepository } from 'typeorm'
import { Ocorrencia } from '../../entities/Ocorrencia'
import OcorrenciaRepository from '../../repositories/OcorrenciaRepositorie'
import { Gravidade } from '../../enums/GravidadeEnum'
import { Status } from '../../enums/OcorrenciaEnum'
import { CondicaoAcidentado } from '../../enums/CondicaoAcidantadoEnum'

type OcorrenciaRequest = {
    id: string
    denuncia: string
    local: string
    data: Date
    nomeVitima: string
    condicaoAcidentado: CondicaoAcidentado
    nomeEmpresaEmpregadora: string
    gravidade: Gravidade
    status: Status
}
export class UpdateOcorrenciaService {
    async execute({
        id,
        denuncia,
        local,
        data,
        nomeVitima,
        condicaoAcidentado,
        nomeEmpresaEmpregadora,
        gravidade,
        status,
    }: OcorrenciaRequest): Promise<Ocorrencia> {
        const repo = getRepository(Ocorrencia)

        const ocorrencia = await repo.findOne(id)

        if (!ocorrencia) {
            throw new Error('Ocorrência não encontrada')
        }

        ocorrencia.condicaoAcidentado = condicaoAcidentado
            ? condicaoAcidentado
            : ocorrencia.condicaoAcidentado
        ocorrencia.gravidade = gravidade ? gravidade : ocorrencia.gravidade
        ocorrencia.status = status ? status : ocorrencia.status

        await repo.save(ocorrencia)

        return ocorrencia
    }
}
