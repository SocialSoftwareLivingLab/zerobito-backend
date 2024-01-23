    import { getCustomRepository } from "typeorm";
    import { CreateUsuarioService, UsuarioResponse } from "./CreateUsuarioService";
    import  UserRepositorie  from "../../repositories/UserRepositorie";
    import { UserRole } from "../../enums/UserRole";
    import logger from "../../shared/logger";
    import { env } from "../../config/configs";


    const log = logger({ context : "CreateFirstAdminSer"});



    export class CreateFirstAdminSer {
        public async execute(): Promise <UsuarioResponse | null> {
            const userRepo = getCustomRepository(UserRepositorie);
            const createUsuarioService = new CreateUsuarioService();
            const atLeastOneAdminExists = !!(await userRepo.findOne({ 
                where: { 
                    role: UserRole.ADMIN }
            
            }));

            if (atLeastOneAdminExists) {
                log.info(
                'Encontrado um usuario com role ADMIN. Nenhum usuario sera criado.',
                );
                return null;
            }
        
            
            log.info('Criando usuário administrador padrão com credenciais de ambiente');
            return createUsuarioService.execute({
                nome: env.backoffice.DEFAULT_ADMIN.nome,
                email: env.backoffice.DEFAULT_ADMIN.email,
                senha: env.backoffice.DEFAULT_ADMIN.senha,
                role: UserRole.ADMIN,
            });
        }
    }