import { getRepository } from "typeorm";
import { compareSync } from "bcryptjs";
import{ sign } from 'jsonwebtoken';
import authConfig from "../config/auth.config";
import { Usuario } from "../entities/Usuario";

interface Request {
    email: string;
    senha: string;
}


interface Response{
    nome : string;
    email: string;
    token: string;
}

class LoginService {
    async execute({email,senha}:Request):Promise<Response>{
        const usuarioRepository = getRepository(Usuario);
        const user = await usuarioRepository.findOne({
            
            where : {email}
        
        });
    
    
        if(!user) throw new Error("Email ou senha incorretos");

        const matched = await compareSync(senha, user.senha);

        if(!matched) throw new Error("Email ou senha incorretos");

        const {expiresIn, secret} = authConfig.jwt;

        const token = sign (
            {
                role: user.role
            },
            secret,
            {
                subject: user.email,
                expiresIn
            },
        );

        return {
            nome: user.nome,
            email: user.email,
            token, 
        };

    }
}

export default LoginService;

