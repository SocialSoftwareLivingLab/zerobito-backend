import { Router } from 'express';
import LoginService from '../services/LoginService';

const loginController = Router();

loginController.post('/login', async (request, response) => {

    try{
        const {senha, email} = request.body;
        const loginService = new LoginService();
        const loginResult = await loginService.execute({
            email,
            senha
        });
      
        return response.json(loginResult);
    } catch (error){
        return response.status(400).json({error: error.message});
    }
});

export default loginController;