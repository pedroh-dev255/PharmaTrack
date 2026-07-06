require('dotenv').config();

const app = require('./app');
const http = require("http");

const pool = require('./src/configs/db');
const redisClient = require('./src/configs/redis');
const websocket = require("./src/ws/index.js");

const PORT = process.env.BACK_PORT || 3000;


async function startServer() {
    try {

        // MYSQL
        const connection = await pool.getConnection();
        console.log('🟢 MySQL conectado');
        connection.release();

        // REDIS
        await redisClient.connect();

        // HTTP SERVER
        const server = http.createServer(app);

        // Inicializa o websocket
        websocket(server);

        // START SERVER
        server.listen(PORT, () => {
            console.log(`🟢 Servidor rodando na porta ${PORT}`);
        });

    } catch (err) {
        console.error('❌ Erro ao iniciar servidor:', err);
        process.exit(1);
    }
}

startServer();