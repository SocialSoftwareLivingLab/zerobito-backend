import { getRepository } from "typeorm";
import { Usuario } from "../../entities/Usuario";
import { hashSync } from "bcryptjs";
import { BackofficeUserJWT } from "../../middlewares/UserAuthenticated";

type UsuarioResquest = {
    nome: string;
    email: string;
    senha: string;
    role?: BackofficeUserJWT;
};


export class CreateUsuarioService {
    async execute({nome, email, senha}: UsuarioResquest) : Promise<Usuario | Error>{
     const repo = getRepository(Usuario);

     //Verificar se o nome já existe
   if (await repo.findOne({ nome })){
   
    return new Error("Nome já cadastrado");
}

    const hashedPassword = hashSync(senha, 8);
    const usuario = repo.create({
         nome,
         email,
        senha: hashedPassword
    });

    await repo.save(usuario);
    return usuario;
}

}



