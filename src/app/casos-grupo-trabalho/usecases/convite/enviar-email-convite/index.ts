import { Injectable } from '@nestjs/common';
import ConviteGrupoTrabalhoEntity from '../../../entities/convite/convite-membro.entity';
import { EmailService } from '@/shared/email/email.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusConviteGrupoTrabalhoEnum } from '../../../enum/status-convite.enum';
import AppException from '@/shared/exceptions/app-exception';
import { MensagensHelper } from '@/helpers/mensagens.helper';

export interface EnviarEmailConviteGrupoUsecaseRequest {
  identificadorConvite: string;
}

@Injectable()
export default class EnviarEmailConviteGrupoUsecase {
  constructor(
    private readonly emailService: EmailService,
    @InjectRepository(ConviteGrupoTrabalhoEntity)
    private readonly conviteRepository: Repository<ConviteGrupoTrabalhoEntity>,
  ) {}

  public async enviarEmail({
    identificadorConvite,
  }: EnviarEmailConviteGrupoUsecaseRequest) {
    const convite = await this.conviteRepository.findOne({
      where: {
        identificador: identificadorConvite,
        status: { codigo: StatusConviteGrupoTrabalhoEnum.PENDENTE },
      },
      relations: ['caso', 'caso.coordenador'],
    });

    if (!convite) {
      throw new AppException(
        MensagensHelper.CasosConviteGrupoTrabalho.CONVITE_NAO_ENCONTRADO,
      );
    }

    const urlFrontendParaAceite = `${process.env.URL_APLICACAO_FRONTEND}/convites/${convite.identificador}`;

    await this.emailService.enviarTextoPuro({
      assunto: 'ZerÓbito | Novo convite para grupo de trabalho',
      destinatario: {
        nome: convite.nomeConvidado,
        email: convite.emailConvidado,
      },
      mensagem: `
        Caro(a) ${convite.nomeConvidado},
        
        <br><br>

        Gostaria de convidar para participação no grupo de trabalho para investigação de um acidente de trabalho, conforme descrição a seguir:
        
        <br><br>
        ${convite.motivo}
        <br><br>

        Pedimos que indique a possibilidade de participação diretamente no sistema, clicando  <a href="${urlFrontendParaAceite}">aqui.</a>

        <br><br>

        Caso não consiga clicar no link acima, copie e cole a seguinte URL no seu navegador: 

        <br><br>

        ${urlFrontendParaAceite}

        <br><br>

        Atenciosamente,
        
        <br><br>

        ${convite.caso.coordenador.nome}
        <br>
        Coordenador do caso
      `,
    });
  }
}
