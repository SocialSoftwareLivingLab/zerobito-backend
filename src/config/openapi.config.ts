import { DocumentBuilder } from '@nestjs/swagger';

const openApiConfig = new DocumentBuilder()
  .setTitle('ZerÓbito Backend')
  .setDescription('Documentação da api do sistema ZerÓbito')
  .setVersion('1.0')
  .addBearerAuth()
  .addTag('Autenticacao', 'Gerencia o escopo de autenticação da plataforma')
  .addTag('Usuarios', 'Gerencia o escopo de usuários da plataforma')
  .build();

export { openApiConfig };
