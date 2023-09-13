import { getRepository} from "typeorm";
import { Usuario } from "../entities/Usuario";


type UsuarioUpdateResquest= {
    id: string;
    nome: string;
    email: string;
    senha: string;
};

export class UpdateUsuarioService{
    async execute(id , nome , email , senha) : Promise<UsuarioUpdateResquest | Error>{
        const repo = getRepository(Usuario);

        const usuario = await repo.findOne(id);

        if(!usuario){
            return new Error("Usuário não encontrado");
        }
    
        usuario.nome = nome ? nome : usuario.nome;
        usuario.email = email ? email : usuario.email;
        usuario.senha = senha ? senha : usuario.senha;

        await repo.save(usuario);

        return usuario;
    
    }
}