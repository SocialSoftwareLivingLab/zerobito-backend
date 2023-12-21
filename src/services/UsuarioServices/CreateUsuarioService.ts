import { getRepository } from "typeorm";
import { Usuario } from "../../entities/Usuario";
import { hashSync } from "bcryptjs";
import { UserRole } from "../../enums/UserRole";

interface UsuarioResquest  {
    nome: string;
    email: string;
    senha: string;
    role?: UserRole;
};

export interface UsuarioResponse {
    nome: string;
    email: string;
    role: UserRole;
};

export class CreateUsuarioService {
    async execute({nome, email, senha , role }: UsuarioResquest) : Promise<UsuarioResponse>{
     const repo = getRepository(Usuario);

     if (await repo.findOne({ where: { email } })) {
        throw new Error("Email já cadastrado");
    }

    const hashedPassword = hashSync(senha, 8);

    const usuarioRole = role ?? UserRole.USER;

    const usuario = repo.create({nome, email, senha: hashedPassword, role :usuarioRole});
    
    await repo.save(usuario);
    
    return usuario;

    }

}



