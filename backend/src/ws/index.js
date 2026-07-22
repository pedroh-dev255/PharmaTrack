const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const redis = require("../configs/redis");
const pool = require("../configs/db");
const manager = require("./connectionManager");

let wss; // Guardamos a instância do WSS aqui para usá-la depois

// Função para obter detalhes dos usuários online
const getOnlineUsersDetails = async () => {
    const userIds = manager.getOnlineUsers();
    
    if (userIds.length === 0) {
        return [];
    }

    try {
        const [users] = await pool.query(
            "SELECT u.id, u.nome, u.nome_exibicao, u.email, r.nome AS Grupo FROM users u INNER JOIN user_roles ur ON ur.user_id = u.id LEFT JOIN roles r ON r.id = ur.role_id WHERE u.id IN (?)",
            [userIds]
        );
        return users;
    } catch (err) {
        console.error("Erro ao buscar detalhes dos usuários online:", err);
        return [];
    }
};

// Função para broadcast da lista de usuários online para todos
const broadcastOnlineUsers = async () => {
    if (!wss) return;

    const users = await getOnlineUsersDetails();

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(
                JSON.stringify({
                    type: "online-users",
                    users: users,
                    count: users.length
                })
            );
        }
    });
};

// Função para enviar notificação para um usuário específico
const sendNotificationToUser = (userId, notification, from) => {
    console.log(`[NOTIF] Enviando notificação para usuário ${userId}:`, notification);
    const connections = manager.getConnections(userId);
    console.log(`[NOTIF] Conexões encontradas para usuário ${userId}:`, connections.size);
    
    if (connections.size === 0) {
        console.warn(`[NOTIF] Nenhuma conexão ativa para o usuário ${userId}`);
        return;
    }

    for (const ws of connections) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(
                JSON.stringify({
                    type: "notification",
                    ...notification
                })
            );
            console.log(`[NOTIF] Notificação enviada ao usuário ${userId}`);
        }
    }
};

// Função para enviar notificação para um grupo específico
const sendNotificationToGroup = async (groupName, notification, from) => {
    if (!wss) {
        console.error(`[NOTIF] WSS não inicializado para enviar notificação ao grupo ${groupName}`);
        return;
    }

    try {
        console.log(`[NOTIF] Buscando grupo: ${groupName}`);
        const [roles] = await pool.query(
            "SELECT id FROM roles WHERE nome = ? OR nome = ?",
            [groupName, groupName.toLowerCase()]
        );

        if (roles.length === 0) {
            console.error(`[NOTIF] Grupo "${groupName}" não encontrado no banco`);
            return;
        }

        const roleId = roles[0].id;
        console.log(`[NOTIF] Role ID encontrado: ${roleId}`);

        const [userIds] = await pool.query(
            "SELECT user_id FROM user_roles WHERE role_id = ?",
            [roleId]
        );

        console.log(`[NOTIF] ${userIds.length} usuários encontrados no grupo "${groupName}"`);

        if(userIds.length == 0 ){
            console.log("[NOTIF] Nenhum usuario online no grupo, retornando para cliente", from);

            sendNotificationToUser(from, {title: "Nenhum usuario encontrado", level: "warning", message: `Nenhum usuario do grupo '${groupName}' esta online neste momento`, sound: "notificacao_alerta" });
            return;
        }

        userIds.forEach((row) => {
            sendNotificationToUser(row.user_id, notification);
        });

        console.log(`[NOTIF] Notificação enviada para ${userIds.length} usuários do grupo "${groupName}"`);
    } catch (err) {
        console.error("[NOTIF] Erro ao enviar notificação para grupo:", err);
    }
};

// Função para enviar notificação para todos
const broadcastNotification = async (notification) => {
    if (!wss) {
        console.error("[NOTIF] WSS não inicializado para broadcast");
        return;
    }

    let count = 0;
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(
                JSON.stringify({
                    type: "notification",
                    ...notification
                })
            );
            count++;
        }
    });

    console.log(`[NOTIF] Notificação broadcast enviada para ${count} clientes online`);
};

const initWS = (server) => {
    wss = new WebSocket.Server({ server });

    wss.on("connection", async (ws, req) => {
        console.log("Nova conexão");

        ws.on("close", (code, reason) => {
            if (ws.user) {
                manager.removeConnection(ws.user.id, ws);
                // Notifica todos sobre a desconexão
                broadcastOnlineUsers();
            }
            console.log("Conexão fechada", code, reason.toString());
        });

        try {
            const url = new URL(req.url, "http://localhost");
            const token = url.searchParams.get("token");

            if (!token) {
                ws.close(1008, "Não autenticado");
                return;
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const redisToken = await redis.get(`user:${decoded.id}:token`);

            if (redisToken !== token) {
                ws.close(1008, "Token inválido");
                return;
            }

            // usuário autenticado
            ws.user = decoded; 
            manager.addConnection(decoded.id, ws);
            console.log("Usuário conectado:", decoded.email);

            ws.send(
                JSON.stringify({
                    type: "connected",
                    user: decoded
                })
            );

            // Envia a lista de usuários online para o novo usuário e notifica todos
            await broadcastOnlineUsers();

        } catch (err) {
            
            console.error("Erro na conexão WS:", err);
            ws.close(1008, "Token inválido");
        }
    });
};

// Função nova para derrubar o usuário específico
const disconnectUserWS = (userId) => {
    if (!wss) return;

    // wss.clients é um Set com todas as conexões ativas
    wss.clients.forEach((client) => {
        // Verifica se a conexão está aberta e se pertence ao usuário do logout
        if (client.readyState === WebSocket.OPEN && client.user && client.user.id === userId) {
            console.log(`Desconectando WS do usuário ${userId} devido ao logout`);
            // Código 1000 = Normal Closure (Fechamento normal/intencional)
            client.close(1000, "Logout realizado"); 
        }
    });
};

module.exports = {
    initWS,
    disconnectUserWS,
    broadcastOnlineUsers,
    sendNotificationToUser,
    sendNotificationToGroup,
    broadcastNotification
};