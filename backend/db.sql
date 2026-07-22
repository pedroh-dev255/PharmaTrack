-- Active: 1750763277253@@127.0.0.1@3306@pharmatrack
CREATE DATABASE IF NOT EXISTS pharmatrack;
USE pharmatrack;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    nome_exibicao VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
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
    id INT NOT NULL,
    chave VARCHAR(100) NOT NULL,
    value BOOLEAN NOT NULL DEFAULT false,
    value2 VARCHAR(500),
    PRIMARY KEY (id)
);

INSERT INTO configs (id, chave, value, value2) VALUES (1, 'register', true, null);