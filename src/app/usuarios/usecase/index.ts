import { Injectable } from '@nestjs/common';
import { EmailService } from '@/shared/email/email.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import AppException from '@/shared/exceptions/app-exception';
import { MensagensHelper } from '@/helpers/mensagens.helper';
import { v4 as uuidv4 } from 'uuid';
import { UsuarioEntity } from '../usuarios.entity';
import { TokenRedefinicaoSenhaEntity } from '../token-redefinicao.entity';

export interface EnviarEmailRedefinicaoSenhaRequest {
  email: string;
}

@Injectable()
export class EnviarEmailRedefinicaoSenhaUsecase {
  constructor(
    private readonly emailService: EmailService,
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
    @InjectRepository(TokenRedefinicaoSenhaEntity)
    private readonly tokenRepository: Repository<TokenRedefinicaoSenhaEntity>,
  ) {}

  public async enviarEmail({
    email,
  }: EnviarEmailRedefinicaoSenhaRequest): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (!usuario) {
      throw new AppException(MensagensHelper.Usuario.USUARIO_NAO_ENCONTRADO);
    }

    const token = uuidv4();
    const dataExpiracao = new Date();
    dataExpiracao.setHours(dataExpiracao.getHours() + 1); // Token válido por 1 hora

    await this.tokenRepository.save({
      token,
      usuario,
      expiracao: dataExpiracao,
    });

    const urlRedefinicao = `${process.env.URL_APLICACAO_FRONTEND}/redefinir-senha?token=${token}`;

    await this.emailService.enviarTextoRedefinicao({
      assunto: 'ZerÓbito | Redefinição de senha',
      destinatario: {
        nome: usuario.nome,
        email: usuario.email,
      },
      mensagem: `
        Olá ${usuario.nome},

        <br><br>

        Recebemos uma solicitação para redefinição de senha da sua conta.

        <br><br>

        Para prosseguir, clique no link abaixo:

        <br><br>

        <a href="${urlRedefinicao}">Redefinir minha senha</a>

        <br><br>

        Se não foi você quem solicitou, ignore este e-mail.

        <br><br>

        Este link expira em 1 hora.

        <br><br>

        Atenciosamente, <br>
        Equipe ZerÓbito
      `,
    });
  }
}
