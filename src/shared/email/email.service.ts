import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EnviarEmailTextoPuroDto, EnviarEmailTextoPuroRedefinicaoDto } from './dtos/enviar-email.dto';

@Injectable()
export class EmailService {
  constructor(private readonly nodemailerService: MailerService) {}

  public async enviarTextoPuro({
    destinatario,
    assunto,
    mensagem,
  }: EnviarEmailTextoPuroDto) {
    await this.nodemailerService.sendMail({
      from: 'Equipe ZerÓbito <nao-responda@zerobito.com>',
      to: `${destinatario.nome} <${destinatario.email}>`,
      subject: assunto,
      html: mensagem,
    });
  }

  public async enviarTextoRedefinicao({
    destinatario,
    assunto,
    mensagem,
  }: EnviarEmailTextoPuroRedefinicaoDto) {
    await this.nodemailerService.sendMail({
      from: 'Equipe ZerÓbito <nao-responda@zerobito.com>',
      to: `${destinatario.nome} <${destinatario.email}>`,
      subject: assunto,
      html: mensagem,
    });
  }
}
