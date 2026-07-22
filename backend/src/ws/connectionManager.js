const WebSocket = require("ws");

// userId => Set<WebSocket>
const userConnections = new Map();

function addConnection(userId, ws) {
    if (!userConnections.has(userId)) {
        userConnections.set(userId, new Set());
    }

    userConnections.get(userId).add(ws);
}

function removeConnection(userId, ws) {
    if (!userConnections.has(userId)) return;

    const connections = userConnections.get(userId);

    connections.delete(ws);

    if (connections.size === 0) {
        userConnections.delete(userId);
    }
}

function getConnections(userId) {
    return userConnections.get(userId) || new Set();
}

function isOnline(userId) {
    return userConnections.has(userId);
}

function getOnlineUsers() {
    return [...userConnections.keys()];
}

function getOnlineUsersDetails() {
    return [...userConnections.entries()].map(([userId, sockets]) => ({
        userId,
        connections: sockets.size
    }));
}

function sendToUser(userId, payload) {
    const connections = getConnections(userId);

    for (const ws of connections) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(payload));
        }
    }
}

module.exports = {
    addConnection,
    removeConnection,
    getConnections,
    getOnlineUsers,
    getOnlineUsersDetails,
    isOnline,
    sendToUser
};