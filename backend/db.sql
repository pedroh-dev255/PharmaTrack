-- Active: 1750763277253@@127.0.0.1@3306@pharmatrack
CREATE DATABASE IF NOT EXISTS pharmatrack;
USE pharmatrack;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    nome_exibicao VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    ativo BOOLEAN DEFAULT true,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT NOT NULL,
    nome VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

INSERT INTO roles (id, nome) VALUES (1, 'Administrador'), (2, 'Usuário'), (3, 'Médico');

CREATE TABLE IF NOT EXISTS user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS configs (
    id INT NOT NULL AUTO_INCREMENT,
    chave VARCHAR(100) NOT NULL,
    value BOOLEAN NOT NULL DEFAULT false,
    value2 VARCHAR(500),
    PRIMARY KEY (id)
);

INSERT INTO configs (id, chave, value, value2) VALUES (1, 'register', true, null);

/*  ================================================================================================  */

CREATE TABLE local_medicamento (
    id int not null AUTO_INCREMENT,
    nome VARCHAR(200) not null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(id)
);

CREATE TABLE grupo_medicamento (
    id int not null AUTO_INCREMENT,
    nome VARCHAR(200) not null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(id)
);

CREATE TABLE medicamentos (
    id int not null AUTO_INCREMENT,

    nome varchar(200) not null,
    principio varchar(300) not null,
    validade date not null,

    disponivel BOOLEAN DEFAULT true,
    dt_retirada DATETIME,

    id_local int not null,
    id_grupo int not null,

    cad_user int not null,
    upd_user int,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY(id),
    Foreign Key (cad_user) REFERENCES users(id),
    Foreign Key (upd_user) REFERENCES users(id),
    Foreign Key (id_grupo) REFERENCES grupo_medicamento(id),
    Foreign Key (id_local) REFERENCES local_medicamento(id)

);
