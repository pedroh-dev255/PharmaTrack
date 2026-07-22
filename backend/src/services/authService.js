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
            "SELECT u.*, r.nome as role FROM users u LEFT JOIN user_roles ur ON ur.user_id = u.id INNER JOIN roles r ON r.id = ur.role_id WHERE u.email = ?",
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
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        
        // =========================
        // SALVA TOKEN NO REDIS
        // =========================
        await redis.set(`user:${user.id}:token`, token,":role", user.role, "EX", process.env.JWT_EXPIRES_IN);

        return {
            id: user.id,
            name: user.nome,
            exib_nome: user.nome_exibicao,
            email: user.email,
            role: user.role,
            token
        };
    }   catch (error) {
        throw new Error(error.message ?? "Erro interno do servidor");
    }

}


async function register(nome, exib_nome, email, password) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        // =========================
        // VERIFICA SE O USUÁRIO JÁ EXISTE
        // =========================
        const [rows] = await connection.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (rows.length > 0) {
            throw new Error("Usuário já existe");
        }
        //console.log('Registrando usuário:', { nome, exib_nome, email, password });
        // =========================
        // CRIA HASH DA SENHA
        // =========================
        const hashedPassword = await bcrypt.hash(password, 10);

        // =========================
        // INSERE USUÁRIO NO BANCO DE DADOS
        // =========================

        //inicia uma transação para garantir que tanto o usuário quanto o papel sejam inseridos corretamente
        

        const [result] = await connection.query(
            "INSERT INTO users (nome, nome_exibicao, email, password) VALUES (?, ?, ?, ?)",
            [nome, exib_nome, email, hashedPassword]
        );

        if (result.affectedRows === 0) {
            throw new Error("Erro ao registrar usuário");
        }

        const [addRole] = await connection.query(
            "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
            [result.insertId, 2] // 2 represents the 'Usuário' role
        );

        if (addRole.affectedRows === 0) {
            throw new Error("Erro ao atribuir papel ao usuário");
        }
        const userdata = await login(email, password);
        return userdata;
    } catch (error) {
        await connection.rollback();
        console.error('Erro ao registrar usuário:', error);
        throw new Error(error.message ?? "Erro interno do servidor");
    } finally {
        if (connection) {
            await connection.release();
        }
    }
}


module.exports = {
    login,
    register
};