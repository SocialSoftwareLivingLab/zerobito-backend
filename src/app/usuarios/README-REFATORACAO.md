# Refatoração do Sistema de Usuários

Este documento descreve a refatoração implementada para o sistema de usuários, introduzindo perfis e permissões estruturados.

## Visão Geral

A refatoração implementa um sistema RBAC (Role-Based Access Control) completo mantendo compatibilidade com o sistema anterior baseado em enum.

## Estrutura do Banco de Dados

### Tabelas Criadas
- `perfil`: Perfis de usuário (ROOT, ADMIN, USER, COORDENADOR)
- `permissao`: Permissões específicas do sistema
- `perfil_permissao`: Relacionamento Many-to-Many entre perfis e permissões (criada automaticamente pelo TypeORM)

### Tabela Atualizada
- `usuario`: Adicionado campo `id_perfil` (opcional, mantendo `perfil_usuario` enum para compatibilidade)

## Entidades

### PerfilEntity
Representa os perfis de usuário no sistema:
- `id`: Identificador único
- `codigo`: Código do perfil (baseado no enum PerfilUsuario)
- `nome`: Nome descritivo do perfil
- `descricao`: Descrição detalhada
- `isPerfilCaso`: Indica se é um perfil específico para casos
- `permissoes`: Relacionamento Many-to-Many com PermissaoEntity

### PermissaoEntity
Representa as permissões específicas:
- `id`: Identificador único
- `codigo`: Código da permissão no formato RBAC (ex: `usuarios:criar`)
- `nome`: Nome descritivo
- `descricao`: Descrição detalhada
- `perfis`: Relacionamento Many-to-Many com PerfilEntity

### UsuarioEntity
Atualizada para incluir:
- `perfil`: Relacionamento Many-to-One com PerfilEntity
- `permissao`: Campo enum mantido para compatibilidade

## Seeds

### PerfisSeed
Cria os perfis baseados no enum `PerfilUsuario`:
- ROOT: Privilégios de sistema completos
- ADMIN: Privilégios administrativos
- USER: Perfil básico
- COORDENADOR: Perfil de coordenação de casos

### PermissoesSeed
Cria as 18 permissões específicas organizadas por módulos funcionais.

### PerfilPermissoesSeed
Associa as permissões aos perfis conforme requisitos específicos:
- ROOT: 18 permissões (acesso total)
- ADMIN: 17 permissões (não pode criar outros admins)
- COORDENADOR: 14 permissões (foco em coordenação)
- USER: 5 permissões básicas

## Serviços

### PerfisService
- `buscarPerfilPorCodigo()`: Busca perfil pelo código do enum
- `buscarPerfilPorId()`: Busca perfil por ID
- `verificarPermissao()`: Verifica se um perfil tem uma permissão específica
- `buscarPermissoesDoPerfil()`: Lista permissões de um perfil

## Guards e Decorators

### @Permissao
Novo decorator para verificar permissões específicas com type safety:

```typescript
import { PermissaoEnum } from './enums/permissoes.enum';

@Permissao(PermissaoEnum.USUARIOS_CRIAR, PermissaoEnum.USUARIOS_ATUALIZAR)
async criarUsuario() {
  // Só executa se o usuário tiver uma das permissões
}
```

### PermissaoGuard
Guard que valida se o usuário autenticado possui as permissões necessárias baseado no seu perfil.

## Sistema de Permissões RBAC

### Formato das Permissões
As permissões seguem o padrão RBAC: `recurso:acao-especifica`
- Exemplos específicos do sistema:
  - `sistema:criar-admin`
  - `ocorrencias:visualizar`, `ocorrencias:aceitar`, `ocorrencias:nao-incorporar`
  - `casos:visualizar-todos`, `casos:alterar-data-obito`, `casos:definir-causa-primaria`
  - `casos:ver-notificacoes`, `casos:enviar-convite-membro`

### Permissões Implementadas
**Sistema/Administração:**
- `sistema:criar-admin`

**Ocorrências:**
- `ocorrencias:visualizar`, `ocorrencias:criar`, `ocorrencias:aceitar`, `ocorrencias:nao-incorporar`

**Casos - Dados Básicos:**
- `casos:visualizar-todos`
- `casos:alterar-data-obito`, `casos:alterar-data-acidente`
- `casos:definir-causa-primaria`, `casos:definir-causa-secundaria`
- `casos:definir-diagnostico`, `casos:definir-comentarios`, `casos:definir-localizacao`

**Casos - Configuração:**
- `casos:cadastrar-causas`, `casos:cadastrar-diagnosticos`

**Casos - Notificações:**
- `casos:ver-notificacoes`, `casos:registrar-notificacao`, `casos:cadastrar-tipos-notificacao`

**Casos - Membros:**
- `casos:enviar-convite-membro`

### Enums e Type Safety
- **PermissaoEnum**: Enum com todas as permissões específicas do sistema

## Integração com JWT

### Token JWT Expandido
O token JWT agora inclui dados completos de perfil e permissões:

```typescript
{
  sub: number,
  email: string,
  nome: string, 
  role: string,
  perfil: {
    id: number,
    codigo: string,
    nome: string,
    permissoes: string[]
  }
}
```

### UsuarioAutenticadoDto
O DTO do usuário autenticado foi expandido:

```typescript
{
  id: number,
  nome: string,
  email: string,
  perfil: PerfilUsuario,
  perfilDetalhado: {
    id: number,
    codigo: string,
    nome: string,
    permissoes: string[]
  }
}
```

### Métodos de Autenticação

#### AuthService.buscarDadosCompletosUsuario()
Busca dados completos do usuário incluindo perfil e permissões.

#### AuthService.gerarTokenAutenticacao()
Atualizado para incluir dados de perfil no token JWT.

### Decorators e Helpers

#### @UsuarioAutenticado
Decorator para extrair o usuário autenticado nos controllers:

```typescript
@Get('/perfil')
@Protegido()
async obterPerfil(@UsuarioAutenticado() usuario: UsuarioAutenticadoDto) {
  return usuario;
}
```

#### usuarioTemPermissao()
Função helper para verificar permissões:

```typescript
const podeCrearAdmin = usuarioTemPermissao(usuario, PermissaoEnum.SISTEMA_CRIAR_ADMIN);
```

#### obterPermissoesUsuario()
Função helper para obter todas as permissões:

```typescript
const permissoes = obterPermissoesUsuario(usuario);
```

### PermissaoGuard Otimizado
O guard foi otimizado para usar dados do JWT quando disponíveis, evitando consultas desnecessárias ao banco:

1. **Primeira tentativa**: Usa permissões do JWT
2. **Fallback**: Consulta banco de dados (compatibilidade com tokens antigos)

### Endpoints de Exemplo

```typescript
// Obter dados do perfil
GET /api/v1/usuarios/perfil

// Obter permissões do usuário
GET /api/v1/usuarios/permissoes
```

### Vantagens da Integração JWT

1. **Performance**: Permissões disponíveis sem consulta ao banco
2. **Escalabilidade**: Reduz carga no banco de dados
3. **Compatibilidade**: Funciona com tokens antigos (fallback automático)
4. **Type Safety**: Tipos TypeScript para todas as estruturas
5. **Developer Experience**: Helpers e decorators facilitam uso

## Exemplo de Uso Completo

```typescript
@Controller('casos')
export class CasosController {
  @Get()
  @Protegido()
  @Permissao(PermissaoEnum.CASOS_VISUALIZAR_TODOS)
  async listarCasos(@UsuarioAutenticado() usuario: UsuarioAutenticadoDto) {
    // Verificar permissão específica usando helper
    if (usuarioTemPermissao(usuario, PermissaoEnum.CASOS_ALTERAR_DATA_OBITO)) {
      // Usuário pode alterar data de óbito
    }
    
    // Obter todas as permissões
    const permissoes = obterPermissoesUsuario(usuario);
    
    return { casos: [], permissoes };
  }
}
```

## Compatibilidade

O sistema mantém total compatibilidade com:
- Enum `PerfilUsuario` existente
- Guards baseados em perfil (`@Perfil`)
- Tokens JWT antigos (via fallback automático)

Esta implementação garante transição suave mantendo funcionalidade existente. 