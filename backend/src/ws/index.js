const { Server } = require("socket.io");

module.exports = function (server) {

    const io = new Server(server, {
        path: "/ws",
        cors: {
            origin: "*"
        }
    });

    io.on("connection", (socket) => {
        console.log(`Cliente conectado: ${socket.id}`);

        socket.on("join", (name) => {

            socket.data.name = name;

            console.log(`${name} entrou no chat.`);

            io.emit("message", {
                system: true,
                text: `${name} entrou no chat.`
            });

        });

        socket.on("message", (text) => {

            if (!socket.data.name) return;

            io.emit("message", {
                system: false,
                user: socket.data.name,
                text,
                time: new Date().toLocaleTimeString()
            });

        });

        socket.on("disconnect", () => {

            if (socket.data.name) {

                io.emit("message", {
                    system: true,
                    text: `${socket.data.name} saiu do chat.`
                });

            }

            console.log(`Cliente desconectado: ${socket.id}`);

        });

    });

};