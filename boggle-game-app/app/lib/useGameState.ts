import { useState, useEffect } from "react";
import { GameState } from "./definitions";
import socket from "../services/socket.service";

export const useGameState = () => {
    const [connected, setConnected] = useState(false);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [gameId, setGameId] = useState("");

    useEffect(() => {
        socket.on("connect", () => {
            setConnected(true);
        });

        socket.on("disconnect", () => {
            setConnected(false);
        });

        socket.on('game-state-update', (data: any) => {
            setGameState(data);
            // console.log('game-state-update recieved:');
            // console.log(data);
        });

        socket.on('message', (data: any) => {
            //setGameState(data);
            console.log('state update recieved');
            console.log(data);
        });

        // Log socket events for debugging
        socket.onAny((event, ...args) => {
            console.log(`Socket event received: ${event}`, args);
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("game-state-update");
            socket.off("message");
        };
    }, []);

    const join = (gameId: string, token: string) => {
        if (socket) {
            socket.emit("join-game", { token, gameId });
            setGameId(gameId);
        }
    };

    return { connected, join, gameState };
}