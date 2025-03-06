'use server';

import { auth } from "@/auth";
import axios from "axios";

const BASE_URL = 'http://boggle-game-boggle-game-server-1:3003/';

export async function newGame(): Promise<{ id: string, board: string[][] }> {
    const response = await post("game", {});
    const game = response.data;
    return {
        id: game.sessionId,
        board: Array.from({ length: 4 }, (_, i) =>
            Array.from({ length: 4 }, (_, j) => game.board.slice(i * 4 + j, i * 4 + j + 1))
        ),
    }
}

export async function startGame(game: string): Promise<boolean> {
    const response = await post("game/start", { sessionId: game });
    return response.data;
}

export async function endGame(id: string) {
    await post("game/end", { sessionId: id });
}

async function getToken(): Promise<string> {
    const session = await auth();
    return session?.user?.accessToken;

}

export async function submitWord(game: string, word: string, path: string): Promise<{ id: string, valid: boolean, }> {
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
async function post(service: string, request: any) {
        const token = await getToken();
        return await axios.post(`${BASE_URL}${service}`, request, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
    
}