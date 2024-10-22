-- Script: Criação de perfis de membros do caso básicos para o sistema

BEGIN;

-- Perfil de Coordenador
INSERT INTO perfil_membro_caso (nome, sigla) VALUES 
('Coordenador do Caso', 'COORDENADOR');

INSERT INTO perfil_membro_caso_permissao (id_perfil_membro_caso, id_permissao)
VALUES 
((SELECT id FROM perfil_membro_caso WHERE sigla = 'COORDENADOR'), (SELECT id FROM permissao WHERE sigla = 'ROLE_CASO_DOSSIE_EDITAR_INFO_BASICA_CAUSA_PRIMARIA')),
((SELECT id FROM perfil_membro_caso WHERE sigla = 'COORDENADOR'), (SELECT id FROM permissao WHERE sigla = 'ROLE_CASO_DOSSIE_EDITAR_INFO_BASICA_CAUSA_SECUNDARIA')),
((SELECT id FROM perfil_membro_caso WHERE sigla = 'COORDENADOR'), (SELECT id FROM permissao WHERE sigla = 'ROLE_CASO_DOSSIE_EDITAR_INFO_BASICA_DIAGNOSTICO')),
((SELECT id FROM perfil_membro_caso WHERE sigla = 'COORDENADOR'), (SELECT id FROM permissao WHERE sigla = 'ROLE_CASO_DOSSIE_EDITAR_INFO_BASICA_PALAVRAS_CHAVE')),
((SELECT id FROM perfil_membro_caso WHERE sigla = 'COORDENADOR'), (SELECT id FROM permissao WHERE sigla = 'ROLE_CASO_DOSSIE_EDITAR_INFO_BASICA_LOCALIZACAO')),
((SELECT id FROM perfil_membro_caso WHERE sigla = 'COORDENADOR'), (SELECT id FROM permissao WHERE sigla = 'ROLE_CASO_NOTIFICACOES_VISUALIZAR')),
((SELECT id FROM perfil_membro_caso WHERE sigla = 'COORDENADOR'), (SELECT id FROM permissao WHERE sigla = 'ROLE_CASO_NOTIFICACOES_REGISTRAR_DOCUMENTO')),
((SELECT id FROM perfil_membro_caso WHERE sigla = 'COORDENADOR'), (SELECT id FROM permissao WHERE sigla = 'ROLE_CASO_GRUPO_TABALHO_VISUALIZAR')),
((SELECT id FROM perfil_membro_caso WHERE sigla = 'COORDENADOR'), (SELECT id FROM permissao WHERE sigla = 'ROLE_CASO_GRUPO_TRABALHO_CONVIDAR_MEMBRO')),
((SELECT id FROM perfil_membro_caso WHERE sigla = 'COORDENADOR'), (SELECT id FROM permissao WHERE sigla = 'ROLE_CASO_GRUPO_TRABALHO_CANCELAR_CONVITE')),
((SELECT id FROM perfil_membro_caso WHERE sigla = 'COORDENADOR'), (SELECT id FROM permissao WHERE sigla = 'ROLE_CASO_GRUPO_TRABALHO_REENVIAR_CONVITE')),
((SELECT id FROM perfil_membro_caso WHERE sigla = 'COORDENADOR'), (SELECT id FROM permissao WHERE sigla = 'ROLE_CASO_PLANEJAMENTO_VISUALIZAR')),
((SELECT id FROM perfil_membro_caso WHERE sigla = 'COORDENADOR'), (SELECT id FROM permissao WHERE sigla = 'ROLE_CASO_INVESTIGACAO_VISUALIZAR'));

-- Perfil de Membro comum
INSERT INTO perfil_membro_caso (nome, sigla) VALUES 
('Membro do Caso', 'MEMBRO');

INSERT INTO perfil_membro_caso_permissao (id_perfil_membro_caso, id_permissao)
VALUES 
((SELECT id FROM perfil_membro_caso WHERE sigla = 'MEMBRO'), (SELECT id FROM permissao WHERE sigla = 'ROLE_CASO_NOTIFICACOES_VISUALIZAR')),
((SELECT id FROM perfil_membro_caso WHERE sigla = 'MEMBRO'), (SELECT id FROM permissao WHERE sigla = 'ROLE_CASO_GRUPO_TABALHO_VISUALIZAR')),
((SELECT id FROM perfil_membro_caso WHERE sigla = 'MEMBRO'), (SELECT id FROM permissao WHERE sigla = 'ROLE_CASO_PLANEJAMENTO_VISUALIZAR')),
((SELECT id FROM perfil_membro_caso WHERE sigla = 'MEMBRO'), (SELECT id FROM permissao WHERE sigla = 'ROLE_CASO_INVESTIGACAO_VISUALIZAR'));

-- COMMIT;
-- rollback;