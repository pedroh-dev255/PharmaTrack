const pool = require("../configs/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const redis = require("../configs/redis");

dotenv.config();


async function login(email, password) {
    try {
        // =========================
        // BUSCA USUÁRIO NO BANCO DE DADOS
        // =========================
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            throw new Error("Usuário não encontrado");
        }

        const user = rows[0];

        // =========================
        // VERIFICA SENHA
        // =========================
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            throw new Error("Senha inválida");
        }

        // =========================
        // GERA TOKEN JWT
        // =========================
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // =========================
        // SALVA TOKEN NO REDIS
        // =========================
        await redis.set(`user:${user.id}:token`, token, "EX", process.env.JWT_EXPIRES_IN);


        return {
            id: user.id,
            name: user.nome,
            exib_nome: user.nome_exibicao,
            email: user.email,
            token
        };
    }   catch (error) {
        throw new Error(error.message ?? "Erro interno do servidor");
    }

}


async function register(nome, exib_nome, email, password) {
    try {
        // =========================
        // VERIFICA SE O USUÁRIO JÁ EXISTE
        // =========================
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (rows.length > 0) {
            throw new Error("Usuário já existe");
        }
        console.log('Registrando usuário:', { nome, exib_nome, email, password });
        // =========================
        // CRIA HASH DA SENHA
        // =========================
        const hashedPassword = await bcrypt.hash(password, 10);

        // =========================
        // INSERE USUÁRIO NO BANCO DE DADOS
        // =========================

        const [result] = await pool.query(
            "INSERT INTO users (nome, nome_exibicao, email, password) VALUES (?, ?, ?, ?)",
            [nome, exib_nome, email, hashedPassword]
        );

        if (result.affectedRows === 0) {
            throw new Error("Erro ao registrar usuário");
        }

        await login(email, password);
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        throw new Error(error.message ?? "Erro interno do servidor");
    }
}


module.exports = {
    login,
    register
};