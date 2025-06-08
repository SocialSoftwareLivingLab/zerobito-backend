# Sistema de Permissões por Caso

## Visão Geral

O sistema de permissões por caso permite que usuários tenham permissões específicas apenas para casos onde são membros do grupo de trabalho. Isso complementa o sistema de permissões globais existente.

## Como Funciona

### 1. Perfis de Caso
- Perfis marcados com `isPerfilCaso: true` podem ser atribuídos a membros de casos
- Cada perfil possui um conjunto específico de permissões
- Perfis de caso são independentes dos perfis globais do usuário

### 2. Atribuição de Perfis
- **Atribuição Automática**: Quando um usuário aceita um convite, recebe automaticamente o perfil MEMBRO
- **Estrutura Simplificada**: O perfil é armazenado diretamente na entidade do membro do grupo de trabalho
- Apenas usuários que são membros do grupo de trabalho podem receber perfis
- Um membro pode ter apenas um perfil por caso
- Coordenadores podem alterar perfis através do endpoint de gerenciamento de membros

### 3. Verificação de Permissões
- O decorator `@PermissaoCaso()` verifica permissões específicas do caso
- O guard extrai o ID do caso da URL automaticamente
- Apenas membros ativos com o perfil adequado têm acesso
- **Performance Otimizada**: Uma única consulta busca todas as permissões do usuário no caso

## Perfis Pré-definidos

### MEMBRO
- **Descrição**: Perfil básico para membros do grupo de trabalho
- **Permissões**:
  - `casos:definir-diagnostico`
  - `casos:definir-causa-primaria`
  - `casos:definir-causa-secundaria`
  - `casos:definir-comentarios`
  - `casos:definir-localizacao`
  - `casos:ver-notificacoes`
  - `casos:registrar-notificacao`

### COORDENADOR
- **Descrição**: Perfil para coordenação completa de casos
- **Permissões**:
  - Todas do MEMBRO +
  - `casos:alterar-data-obito`
  - `casos:alterar-data-acidente`
  - `casos:enviar-convite-membro`

## Uso nos Controllers

### Aplicando Permissões de Caso

```typescript
@Put('/:id/informacoes-basicas')
@PermissaoCaso(
  PermissaoEnum.CASOS_DEFINIR_CAUSA_PRIMARIA,
  PermissaoEnum.CASOS_DEFINIR_CAUSA_SECUNDARIA,
  PermissaoEnum.CASOS_DEFINIR_DIAGNOSTICO
)
public async editarInformacoesBasicas(
  @Param('id') id: number,
  @Body() payload: EditarInformacoesBasicasRequest,
) {
  await this.casosService.editarInformacoesBasicas(id, payload);
}
```

### Endpoints de Gerenciamento

#### Listar Perfis Disponíveis
```
GET /api/v1/casos/perfis-caso
```

#### Atribuir Perfil a Membro
```
POST /api/v1/casos/:idCaso/grupo-trabalho/membros/:idMembro/perfil
{
  "idPerfil": 1
}
```

#### Remover Perfil de Membro
```
DELETE /api/v1/casos/:idCaso/grupo-trabalho/membros/:idMembro/perfil
```

#### Verificar Minhas Permissões no Caso
```
GET /api/v1/casos/:idCaso/minhas-permissoes
```

## Fluxo de Trabalho

### 1. Convite e Aceite
1. Coordenador convida usuário para o grupo de trabalho
2. Usuário aceita o convite e torna-se membro
3. **Sistema atribui automaticamente o perfil MEMBRO**
4. Coordenador pode alterar o perfil para COORDENADOR se necessário

### 2. Verificação de Acesso
1. Usuário tenta acessar endpoint protegido
2. Guard verifica se usuário é membro ativo do caso
3. Guard verifica se o perfil do membro possui a permissão necessária
4. Acesso liberado ou negado

### 3. Gerenciamento de Perfis
- Coordenadores podem alterar perfis de membros a qualquer momento
- Perfis podem ser removidos, deixando o membro sem permissões específicas
- Histórico de alterações é mantido através dos timestamps

## Diferenças do Sistema Global

| Aspecto | Sistema Global | Sistema de Caso |
|---------|---------------|-----------------|
| Escopo | Toda aplicação | Caso específico |
| Atribuição | Por usuário | Por membro do caso |
| Decorator | `@Permissao()` | `@PermissaoCaso()` |
| Verificação | Perfil do usuário | Perfil no caso |
| Persistência | Permanente | Enquanto for membro |

## Considerações Técnicas

### Performance
- Consultas otimizadas com eager loading
- Cache pode ser implementado para verificações frequentes
- Índices recomendados nas tabelas de relacionamento

### Segurança
- Verificação dupla: membro ativo + permissão válida
- Soft delete para auditoria
- Logs de alterações de perfis

### Escalabilidade
- Estrutura permite múltiplos perfis por usuário em casos diferentes
- Suporte a hierarquia de permissões
- Extensível para novos tipos de perfis

## Exemplos de Uso

### Cenário 1: Membro Básico
```typescript
// Usuário com perfil MEMBRO pode:
@PermissaoCaso(PermissaoEnum.CASOS_DEFINIR_COMENTARIOS)
async adicionarComentario() { /* ... */ } // ✅

@PermissaoCaso(PermissaoEnum.CASOS_DEFINIR_CAUSA_PRIMARIA)
async definirCausa() { /* ... */ } // ✅

// Mas NÃO pode:
@PermissaoCaso(PermissaoEnum.CASOS_ENVIAR_CONVITE_MEMBRO)
async convidarMembro() { /* ... */ } // ❌ Acesso negado
```

### Cenário 2: Coordenador
```typescript
// Usuário com perfil COORDENADOR pode fazer tudo:
@PermissaoCaso(PermissaoEnum.CASOS_DEFINIR_COMENTARIOS)
async adicionarComentario() { /* ... */ } // ✅

@PermissaoCaso(PermissaoEnum.CASOS_ENVIAR_CONVITE_MEMBRO)
async convidarMembro() { /* ... */ } // ✅
```

### Cenário 3: Múltiplos Casos
```typescript
// Mesmo usuário pode ter perfis diferentes em casos diferentes:
// Caso 123: MEMBRO (atribuído automaticamente ao aceitar convite)
// Caso 456: COORDENADOR (alterado manualmente pelo coordenador)
// Caso 789: Sem vínculo (sem acesso)
``` 