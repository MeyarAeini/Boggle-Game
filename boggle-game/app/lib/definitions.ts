export type BoardState = {
    board: string[][],
    cursor: BoardPosition,
    word: string,
    path: string,
    visited: boolean[]
};

export type BoardPosition = {
    i: number,
    j: number
};