import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import logger from '../shared/logger'
import { UserRole } from '../enums/UserRole'
import { env } from '../config/configs'

const log = logger({ context: 'UserAuthenticated' })

export interface BackofficeUserJWT {
  identity: string // O identificador do usuário que está autenticado pelo token JWT.
  role: UserRole // O papel do usuário que está autenticado pelo token JWT.
  iat: number // O tempo de emissão do token JWT.
  exp: number // O tempo de expiração do token JWT.
}

/* 
1) Obtem o cabeçalho de autorização da requisição.
2) Verifica se o cabeçalho de autorização existe. Se não existir, a função re   torna um erro 403 com a mensagem "No token provided.".
3) Extrai o token JWT do cabeçalho de autorização.
4) Tenta verificar o token JWT usando a chave secreta da configuração de autenticação.
    Se a verificação for bem-sucedida, a função retorna um objeto BackofficeUserJWT que contém as informações do usuário autenticado.
    Se a verificação falhar, a função retorna um erro 401 com a mensagem "Token expired or invalid.".
5)  Armazena o objeto BackofficeUserJWT no objeto req.locals.
*/

function deserializeJwt(req: Request, res: Response): BackofficeUserJWT | null {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    res.status(403).json({ message: 'No token provided.' })
    return null
  }

  const [, token] = authHeader.split(' ')
  try {
    const jwt = verify(token, env.jwt.secret) as BackofficeUserJWT

    res.locals.user = jwt

    return jwt
  } catch (err) {
    log.error(err)
    res.status(401).json({ message: 'Token expired or invalid.' })
    return null
  }
}

/*
1) Chama a função deserializeJwt() para obter as informações do usuário autenticado.
2) Verifica se o usuário autenticado é um administrador. Se não for, a função retorna um erro 403 com a mensagem "You are not authorized to perform this action.".
3) Registra uma mensagem de log indicando que um administrador realizou uma solicitação.
4) Chama o próximo middleware na cadeia.
*/
export function UserIsAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  deserializeJwt(req, res)
  const user = res.locals.user as BackofficeUserJWT

  if (user.role !== UserRole.ADMIN) {
    log.warn(
      `Non admin user ${user.identity} tried to perform a ${req.method} request to ${req.originalUrl};`,
    )
    res.status(403).json({
      message: 'You are not authorized to perform this action.',
    })
    return null
  }

  log.info(
    `Admin ${user.identity} performed a ${req.method} request to ${req.originalUrl};`,
  )

  next()
}

/*
1) Chama a função deserializeJwt() para obter as informações do usuário autenticado.
2) Verifica se o usuário está autenticado. Se não estiver, a função retorna um erro 401 com a mensagem "Unauthorized.".
3) Registra uma mensagem de log indicando que um usuário autenticado realizou uma solicitação.
4) Chama o próximo middleware na cadeia.
*/

export function UserIsAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  deserializeJwt(req, res)
  const user = res.locals.user as BackofficeUserJWT
  log.info(
    `User ${user.identity} performed a ${req.method} request to ${req.originalUrl};`,
  )

  next()
}
