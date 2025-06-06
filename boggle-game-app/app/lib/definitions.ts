export type BoardState = {
    board: string[][],
    cursor: BoardPosition,
    word: string,
    path: string,
    visited: boolean[],
    visiting: boolean,
};

export type BoardPosition = {
    i: number,
    j: number
};

export type BoardPath = {
    path: string,
    word: string,
    game?: string
}

export type Game = {
    id: Number,
    name: string,
    score?: Number
}

export type WordScore = {
    word: string,
    score: number,
}

export type GameSession = {
    sessionId: string,
    board: string[][],
    startTime: Date,
    endTime: Date,
    timeElapsed: number,
    boardId: string,
}

export type SubmittedWord = {
    path: string,
    word: string,
    valid: boolean,
    score: number,
}

export type Player = {
    id: string,
    email: string,
    name: string,
    score : number,
}

export type GameState = {
    gameId : string,
    players : Player[],
}

export type BoardSolution = {
    scores: Map<number,number>,
    lengths: Map<number,number>,

}