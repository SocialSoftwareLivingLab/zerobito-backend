import { Router } from 'express';
import LoginService from '../services/LoginService';
const sessionsRouter = Router();

sessionsRouter.post('/login', async (request, response) => {

    try{
        const {email, senha} = request.body;
        const loginService = new LoginService();
        
        const data = await loginService.execute({
            email,
            senha
        });

        console.log(response.json(data));
        return response.json(data);

    } catch (error){
        return response.status(400).json({error: error.message});
    }
});

export default sessionsRouter;