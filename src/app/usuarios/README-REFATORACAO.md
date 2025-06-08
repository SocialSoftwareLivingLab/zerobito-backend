# Refatoração do Sistema de Usuários

## Visão Geral

Esta refatoração implementa um sistema de perfis e permissões mais flexível, mantendo compatibilidade com o enum `PerfilUsuario` existente.

## Estrutura Implementada

### Entidades

1. **PerfilEntity** (`perfil`)
   - `id`: Chave primária
   - `codigo`: Código único (corresponde aos valores do enum `PerfilUsuario`)
   - `isPerfilCaso`: Booleano indicando se é um perfil específico para casos
   - `nome`: Nome descritivo do perfil
   - `descricao`: Descrição detalhada (opcional)
   - `permissoes`: Relacionamento many-to-many com permissões

2. **PermissaoEntity** (`permissao`)
   - `id`: Chave primária
   - `codigo`: Código único da permissão
   - `nome`: Nome descritivo
   - `descricao`: Descrição detalhada (opcional)
   - `perfis`: Relacionamento many-to-many com perfis

3. **UsuarioEntity** (atualizada)
   - Mantém o campo `permissao` (enum) para compatibilidade
   - Adiciona campo `perfil` (relacionamento com PerfilEntity)

### Relacionamento Many-to-Many

Utilizamos o relacionamento `@ManyToMany` nativo do TypeORM, que cria automaticamente a tabela de junção `perfil_permissao` com as colunas:
- `id_perfil`
- `id_permissao`

**Vantagens dessa abordagem:**
- Não precisamos de uma entidade separada para a tabela de junção
- O TypeORM gerencia automaticamente o relacionamento
- Código mais limpo e simples
- Queries mais eficientes

## Seeds Implementados

1. **PerfisSeed**: Cria os perfis baseados no enum existente
2. **PermissoesSeed**: Cria permissões básicas do sistema
3. **PerfilPermissoesSeed**: Associa permissões aos perfis

### Mapeamento de Permissões por Perfil

- **ROOT**: Todas as permissões do sistema (acesso total)
- **ADMIN**: Permissões administrativas completas (exceto criar outros admins)
- **COORDENADOR**: Permissões de coordenação e gestão de casos
- **USER**: Permissões básicas de visualização e criação de ocorrências

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

```typescript
// Exemplo de uso com type safety
import { PermissaoEnum } from './enums/permissoes.enum';

// Uso direto do enum
@Permissao(PermissaoEnum.CASOS_ALTERAR_DATA_OBITO)
@Permissao(PermissaoEnum.OCORRENCIAS_ACEITAR, PermissaoEnum.OCORRENCIAS_NAO_INCORPORAR)
```

## Compatibilidade

- O enum `PerfilUsuario` é mantido
- Todas as funcionalidades existentes continuam funcionando
- O campo `permissao` na entidade de usuário é preservado
- Transição gradual possível

## Estrutura de Banco

### Tabelas Criadas
- `perfil`
- `permissao` 
- `perfil_permissao` (tabela de junção automática)

### Tabela Modificada
- `usuario` (adiciona campo `id_perfil`)

## Próximos Passos (Opcionais)

1. Migrar gradualmente do uso do enum para o sistema de perfis
2. Adicionar interface administrativa para gerenciar perfis e permissões
3. Implementar permissões mais granulares conforme necessário
4. Eventualmente remover o campo `permissao` (enum) quando não for mais necessário 