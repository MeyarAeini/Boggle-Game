import axios from "axios";

export async function newGame(token: string): Promise<{ id: string, board: string[][] }> {
    const response = await post("game", {}, token);
    const game = response.data;
    return {
        id: game.sessionId,
        board: Array.from({ length: 4 }, (_, i) =>
            Array.from({ length: 4 }, (_, j) => game.board.slice(i * 4 + j, i * 4 + j + 1))
        ),
    }
}

export async function startGame(token: string, game: string): Promise<boolean> {
    const response = await post("game/start", { sessionId: game }, token);
    return response.data;
}

export async function endGame(token: string, game: string): Promise<boolean> {
    const response = await post("game/end", { sessionId: game }, token);
    return response.data;
}

export async function submitWord(token: string, game: string, word: string, path: string): Promise<{ id: string, valid: boolean, }> {
    const response = await post("word-submission", { game: game, word: word, path: path, }, token);
    return response.data;
}

async function post(service: string, request: any, token: string) {
    return await axios.post(`http://localhost:3003/${service}`, request, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
}