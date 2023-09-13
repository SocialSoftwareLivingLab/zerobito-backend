//Classe que ira reverenciar uma table dentro meu banco de dados.
import { Entity , Column , PrimaryColumn} from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("usuarios")
export class Usuario{
    
    @PrimaryColumn()
    id: string;

    @Column()
    nome:string;
    
    @Column()
    email:string;

    @Column()
    senha:string;
    role: any;

    constructor(){ // Evitar que o usuario tenha que passar o id na hora de criar um novo usuario.
        if(!this.id){
            this.id = uuid();
        }
    }
}