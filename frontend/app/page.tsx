"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function Home() {

    const socket = useRef<Socket | null>(null);

    const [connected, setConnected] = useState(false);

    const [joined, setJoined] = useState(false);

    const [name, setName] = useState("");

    const [text, setText] = useState("");

    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {

        socket.current = io(process.env.NEXT_PUBLIC_WS_URL!, {

            path: "/ws",

            transports: ["websocket"]

        });

        socket.current.on("connect", () => {

            setConnected(true);

        });

        socket.current.on("disconnect", () => {

            setConnected(false);

        });

        socket.current.on("message", (msg) => {

            setMessages(prev => [...prev, msg]);

        });

        return () => {

            socket.current?.disconnect();

        };

    }, []);

    function join() {

        if (!name.trim()) return;

        socket.current?.emit("join", name);

        setJoined(true);

    }

    function send() {

        if (!text.trim()) return;

        socket.current?.emit("message", text);

        setText("");

    }

    if (!joined) {

        return (

            <main style={{ padding: 40 }}>

                <h1>Micro Chat</h1>

                <p>WebSocket: {connected ? "🟢 Online" : "🔴 Offline"}</p>

                <input
                    placeholder="Digite seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <button onClick={join}>
                    Entrar
                </button>

            </main>

        );

    }

    return (

        <main style={{ padding: 40 }}>

            <h1>Micro Chat</h1>

            <p>Você é <b>{name}</b></p>

            <div
                style={{
                    height: 400,
                    overflowY: "auto",
                    border: "1px solid #ccc",
                    padding: 10,
                    marginBottom: 20
                }}
            >

                {messages.map((m, index) => (

                    <div key={index}>

                        {m.system ? (

                            <i>{m.text}</i>

                        ) : (

                            <>
                                <b>{m.user}</b> [{m.time}]
                                <br />
                                {m.text}
                            </>

                        )}

                        <hr />

                    </div>

                ))}

            </div>

            <input
                style={{ width: "80%" }}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Digite uma mensagem..."
                onKeyDown={(e) => {

                    if (e.key === "Enter") {

                        send();

                    }

                }}
            />

            <button onClick={send}>
                Enviar
            </button>

        </main>

    );

}