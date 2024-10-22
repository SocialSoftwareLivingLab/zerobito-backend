-- Script: Criação de perfis de usuários básicos para o sistema

BEGIN TRAN 

-- Perfil de Administrador
INSERT INTO perfil_usuario (nome, sigla, descricao) VALUES 
('Administrador', 'ADMIN', 'Perfil de administrador do sistema');

INSERT INTO perfil_usuario_permissao (id_perfil_usuario, id_permissao)
VALUES 
((SELECT id FROM perfil_usuario WHERE sigla = 'ADMIN'), (SELECT id FROM permissao WHERE sigla = 'ROLE_COMUNICACAO_EVENTO_CADASTRAR')),
((SELECT id FROM perfil_usuario WHERE sigla = 'ADMIN'), (SELECT id FROM permissao WHERE sigla = 'ROLE_COMUNICACAO_EVENTO_VISUALIZAR')),
((SELECT id FROM perfil_usuario WHERE sigla = 'ADMIN'), (SELECT id FROM permissao WHERE sigla = 'ROLE_COMUNICACAO_EVENTO_ACEITAR')),
((SELECT id FROM perfil_usuario WHERE sigla = 'ADMIN'), (SELECT id FROM permissao WHERE sigla = 'ROLE_COMUNICACAO_EVENTO_ACOMPANHAR')),
((SELECT id FROM perfil_usuario WHERE sigla = 'ADMIN'), (SELECT id FROM permissao WHERE sigla = 'ROLE_COMUNICACAO_EVENTO_RECUSAR')),
((SELECT id FROM perfil_usuario WHERE sigla = 'ADMIN'), (SELECT id FROM permissao WHERE sigla = 'ROLE_CASOS_VISUALIZAR_TODOS'));

-- Perfil de Coordenador Geral
INSERT INTO perfil_usuario (nome, sigla, descricao) VALUES 
('Coordenador Geral', 'COORDENADOR_GERAL', 'Perfil do coordenador geral do sistema');

INSERT INTO perfil_usuario_permissao (id_perfil_usuario, id_permissao)
VALUES 
((SELECT id FROM perfil_usuario WHERE sigla = 'COORDENADOR_GERAL'), (SELECT id FROM permissao WHERE sigla = 'ROLE_COMUNICACAO_EVENTO_CADASTRAR')),
((SELECT id FROM perfil_usuario WHERE sigla = 'COORDENADOR_GERAL'), (SELECT id FROM permissao WHERE sigla = 'ROLE_COMUNICACAO_EVENTO_VISUALIZAR')),
((SELECT id FROM perfil_usuario WHERE sigla = 'COORDENADOR_GERAL'), (SELECT id FROM permissao WHERE sigla = 'ROLE_COMUNICACAO_EVENTO_ACEITAR')),
((SELECT id FROM perfil_usuario WHERE sigla = 'COORDENADOR_GERAL'), (SELECT id FROM permissao WHERE sigla = 'ROLE_COMUNICACAO_EVENTO_ACOMPANHAR')),
((SELECT id FROM perfil_usuario WHERE sigla = 'COORDENADOR_GERAL'), (SELECT id FROM permissao WHERE sigla = 'ROLE_COMUNICACAO_EVENTO_RECUSAR')),
((SELECT id FROM perfil_usuario WHERE sigla = 'COORDENADOR_GERAL'), (SELECT id FROM permissao WHERE sigla = 'ROLE_CASOS_VISUALIZAR_TODOS'));

-- commit rollback