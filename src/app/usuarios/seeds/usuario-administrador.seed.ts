import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import SeedRunner from '@/shared/seeds/seed-runner';
import { UsuarioEntity } from '../usuarios.entity';
import { PerfilUsuario } from '../enums/perfil-usuario.enum';
import { UsuariosService } from '../usuarios.service';
import { CriarUsuarioRequestDto } from '../dtos/criar-usuario.dto';

/**
 * Seed do usuário administrador ROOT
 *
 * Cria um usuário administrador inicial com perfil ROOT apenas se a base estiver vazia.
 * Utiliza o UsuariosService para garantir todas as validações e relacionamentos corretos.
 *
 * Credenciais:
 * - Email: root@zerobito.com
 * - Senha: Admin1234*
 * - Perfil: ROOT (todas as permissões do sistema)
 *
 * Execução condicional:
 * - Só executa se não existir nenhum usuário na base
 * - Utiliza o service que já valida se perfis existem
 * - Tratamento de erro caso perfis não estejam disponíveis
 */
@Injectable()
export default class UsuarioAdministradorSeed implements SeedRunner {
  private readonly logger = new Logger(UsuarioAdministradorSeed.name);

  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
    private readonly usuariosService: UsuariosService,
  ) {}

  async run() {
    this.logger.log('Seed do usuário administrador ROOT...');

    // Verificar se já existem usuários na base
    const quantidadeUsuarios = await this.usuarioRepository.count();
    if (quantidadeUsuarios > 0) {
      this.logger.log('Base já possui usuários, pulando seed do administrador');
      return;
    }

    this.logger.log('Base vazia, criando usuário administrador ROOT');

    try {
      // Criar dados do usuário
      const dadosUsuario: CriarUsuarioRequestDto = {
        nome: 'Administrador do Sistema',
        email: 'root@zerobito.com',
        senha: 'Admin1234*',
      };

      // Criar usuário usando o service (que já faz todas as validações e relacionamentos)
      const usuarioAdmin = await this.usuariosService.adicionar(
        dadosUsuario,
        PerfilUsuario.ROOT,
      );

      this.logger.log(
        `Usuário administrador criado com sucesso: ${usuarioAdmin.email}`,
      );
      this.logger.log(`Perfil vinculado: ${PerfilUsuario.ROOT}`);
    } catch (error) {
      this.logger.error(
        `Erro ao criar usuário administrador: ${error.message}`,
      );
    }
  }
}
