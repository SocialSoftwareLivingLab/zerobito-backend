import { Entity , Column , PrimaryColumn} from "typeorm";

@Entity("ocorrencia")
export class Ocorrencia{

@PrimaryColumn()
id: string;

@Column()
denuncia: string;

@Column()
local: string;

@Column()
data: Date;

@Column()
condicao:string;

@Column()
gravidade:string;

@Column()
status:string;//Andamento do Caso

}
