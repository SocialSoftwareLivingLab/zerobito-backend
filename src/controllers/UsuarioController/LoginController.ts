import { Request, Response, Router } from 'express'
import LoginService from '../../services/UsuarioServices/LoginService'

const loginController = Router()

loginController.post('/login', async (request: Request, response: Response) => {
    try {
        const { email, senha } = request.body
        const loginService = new LoginService()
        const loginResult = await loginService.execute({ email, senha })

        return response.json(loginResult)
    } catch (error) {
        return response.status(400).json({ error: error.message })
    }
})

export default loginController
