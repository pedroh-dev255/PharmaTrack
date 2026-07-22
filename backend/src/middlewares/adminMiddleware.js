const jwt = require('jsonwebtoken');
const redis = require('../configs/redis');
const pool = require('../configs/db');

/**
 * Middleware para verificar se o usuário é administrador
 * Valida com JWT, Redis e Banco de Dados
 * NUNCA confia apenas no frontend!
 */
async function isAdminMiddleware(req, res, next) {
    try {
        // =========================
        // PEGAR TOKEN
        // =========================
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token não fornecido'
            });
        }

        // =========================
        // VALIDAR JWT
        // =========================
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }

        // =========================
        // VALIDAR COM REDIS
        // =========================
        const redisToken = await redis.get(`user:${decoded.id}:token`);
        
        if (!redisToken || redisToken !== token) {
            return res.status(401).json({
                success: false,
                message: 'Sessão expirada ou token inválido'
            });
        }

        // =========================
        // VERIFICAR NO BANCO DE DADOS
        // =========================
        const [userRoles] = await pool.query(
            `SELECT r.nome FROM user_roles ur 
             INNER JOIN roles r ON r.id = ur.role_id 
             WHERE ur.user_id = ?`,
            [decoded.id]
        );

        // Verificar se tem role de admin
        const isAdmin = userRoles.some(role => 
            role.nome.toLowerCase() === 'admin' || 
            role.nome.toLowerCase() === 'administrador'
        );

        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Acesso negado: Permissões insuficientes'
            });
        }

        // =========================
        // TUDO OK
        // =========================
        req.user = decoded;
        req.isAdmin = true;
        next();

    } catch (error) {
        console.error('Erro no middleware de admin:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao validar permissões'
        });
    }
}

module.exports = isAdminMiddleware;
