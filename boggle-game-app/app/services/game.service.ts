'use server';

import axios from "axios";
import { redirect } from "next/navigation";
import { BASE_URL, getToken, post } from "./base.service";
import { GameSession } from "../lib/definitions";

export async function newGame(): Promise<GameSession> {
    const response = await post("game", {});
    const game = response.data;
    return getGameSession(game);
}

function getGameSession(data: any): GameSession {
    console.log(data.startTime);
    const toDate = new Date(!!data.endTime ? data.endTime : data.now);
    const fromDate = new Date(data.startTime ? data.startTime : data.now);
    const elapsed = toDate.getTime() - fromDate.getTime();
    return {
        sessionId: data.sessionId,
        startTime: data.startTime,
        endTime: data.endTime,
        timeElapsed: elapsed,
        board: Array.from({ length: 4 }, (_, i) =>
            Array.from({ length: 4 }, (_, j) => data.board.slice(i * 4 + j, i * 4 + j + 1))),
    };
}

export async function startGame(game: string): Promise<boolean> {
    const response = await post("game/start", { sessionId: game });
    return response.data;
}

export async function endGame(id: string, next: any) {
    await post("game/end", { sessionId: id }).then(() => next);
    redirect("/my-games");
}



export async function submitWord(game: string, word: string, path: string): Promise<{ id: string, valid: boolean, score: number, }> {
    const response = await post("word-submission", { game: game, word: word, path: path, });
    return response.data;
}

export async function getMyGames(page: number, take: number) {
    try {
        const response = await axios.get(`${BASE_URL}game/list?page=${page}&take=${take}`, {
            headers: {
                'Authorization': `Bearer ${await getToken()}`
            },
        });
        return response.data;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getLastSession(): Promise<GameSession> {
    try {
        const response = await axios.get(`${BASE_URL}game/lastsession`, {
            headers: {
                'Authorization': `Bearer ${await getToken()}`
            },
        });
        return getGameSession(response.data);
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getMyGamesCount() {
    try {
        const response = await axios.get(`${BASE_URL}game/count`, {
            headers: {
                'Authorization': `Bearer ${await getToken()}`
            },
        });
        return response.data;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
