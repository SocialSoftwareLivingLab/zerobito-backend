import { Router } from 'express'
import LoginService from '../services/UsuarioServices/LoginService'
import logger from '../shared/logger'
import { log } from 'winston'

log = logger({ context: 'loginRoutes' })

const sessionsRouter = Router()

sessionsRouter.post('/login', async (request, response) => {
    try {
        const { email, senha } = request.body
        const loginService = new LoginService()

        const data = await loginService.execute({
            email,
            senha,
        })

        log.info("Autenticando o usuário {}", email)
        return response.json(data)
    } catch (error) {
        return response.status(400).json({ error: error.message })
    }
})

export default sessionsRouter
