import { useState, useEffect } from "react";
import { GameState } from "./definitions";
import socket from "../services/socket.service";

export const useGameState = () => {
    const [connected, setConnected] = useState(false);
    const [gameState, setGameState] = useState({});
    const [gameId, setGameId] = useState("");

    useEffect(() => {
        socket.on("connect", () => {
            setConnected(true);
        });

        socket.on("disconnect", () => {
            setConnected(false);
        });

        socket.on("game-state-updated", (data: GameState) => {
            setGameState(data);
        });

        return () => { socket.disconnect() };
    }, []);

    const join = (gameId: string, token:string) => {
        if (socket && token) {
            socket.emit("join-game", { token, gameId });
            setGameId(gameId);
        }
    };

    return { connected, join, gameState };
}