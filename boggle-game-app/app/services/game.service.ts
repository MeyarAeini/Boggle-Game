'use server';

import { redirect } from "next/navigation";
import { post, query } from "./base.service";
import { GameSession, Player, SubmittedWord } from "../lib/definitions";

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
        board: data.board ? Array.from({ length: 4 }, (_, i) =>
            Array.from({ length: 4 }, (_, j) => data.board.slice(i * 4 + j, i * 4 + j + 1))) : [[]],
        boardId: data.board
    };
}

export async function startGame(game: string) {
    await post("game/start", { sessionId: game });
    redirect("/game");
}

export async function joinGame(game: string) {
    await post("game/join", { sessionId: game });
    redirect("/game");
}

export async function endGame(id: string, next: any) {
    await post("game/end", { sessionId: id }).then(() => next);
    redirect("/history");
}



export async function submitWord(game: string, word: string, path: string): Promise<{ id: string, valid: boolean, score: number, }> {
    const response = await post("word-submission", { game: game, word: word, path: path, });
    return response.data;
}

export async function getSubmittedWords(gameId: string): Promise<SubmittedWord[]> {
    try {
        const response = await query(`word-submission?gameId=${gameId}`);
        return response.data.map((it: any) => ({
            path: it.path,
            word: it.word,
            valid: it.valid,
            score: it.score ? it.score : 0,
        }));
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getMyGames(page: number, take: number) {
    try {
        const response = await query(`game/list?page=${page}&take=${take}`);
        return response.data;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getLastSession(): Promise<GameSession> {
    try {
        const response = await query(`game/lastsession`);
        return getGameSession(response.data);
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getGamePlayers(gameId: string): Promise<Player[]> {
    try {
        const response = await query(`game/players?gameId=${gameId}`);
        return response.data;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getMyGamesCount() {
    try {
        const response = await query('game/count');
        return response.data;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
