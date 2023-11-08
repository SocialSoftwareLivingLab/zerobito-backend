import { Entity , Column , PrimaryColumn} from "typeorm";
import { SelectQuery } from "typeorm/query-builder/SelectQuery";
import { Gravidade } from "../enums/GravidadeEnum";
import { Status } from "../enums/OcorrenciaEnum";
import { CondicaoAcidentado } from "../enums/CondicaoAcidantadoEnum";
import {v4 as uuid} from "uuid";
 

@Entity("ocorrencias")
export class Ocorrencia{

@PrimaryColumn()
id: string;

@Column()
denuncia: string;

@Column()
local: string;

@Column({ type: 'date' })
data: Date;

@Column()
nomeVitima: string;

@Column()
tipoOcorrencia: string;

@Column()
nomeContato: string;

@Column()
emailContato: string;

@Column()
telefoneContato: string;

@Column({
    type: "enum",
    enum: CondicaoAcidentado,
})
condicaoAcidentado: CondicaoAcidentado;

@Column()
nomeEmpresaEmpregadora: string;

@Column({
    type: "enum",
    enum: Gravidade,
})
gravidade: Gravidade;

@Column({ 
    type: "enum",
    enum: Status,
  })
  status: Status;

  constructor() {
    if (!this.id) {
        this.id = uuid();
    }
}

}

