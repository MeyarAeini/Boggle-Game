import { io } from "socket.io-client";

const SESSION_URL = "http://localhost:4000";

const socket = io(SESSION_URL, {
    transports: ["websocket"], // Force WebSocket, avoid polling issues
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 5000,
    timeout: 10000, // Ensure a 10s timeout before disconnect
});

export default socket;