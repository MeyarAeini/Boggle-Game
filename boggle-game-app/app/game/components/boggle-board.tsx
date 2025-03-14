'use client';

import BuggleLetter from "./boggle-letter";
import { BoardState } from "../../lib/definitions";
import { useState } from "react";

interface BoggleBoardProps {
    gameId: string,
    board: string[][],
    onWordSubmited: (path: string, word: string) => boolean,
    onCurrentWordChanged: (word: string) => void,
}

export default function BoggleBoard(
    {
        gameId,
        board,
        onWordSubmited,
        onCurrentWordChanged
    }: BoggleBoardProps) {
    //board current state
    const [state, setState] = useState<BoardState>(
        {
            board: board,
            cursor: { i: -1, j: -1 },
            word: "",
            path: "",
            visited: Array.from({ length: 16 }, () => false),
            visiting: false
        });

    function onVisit(index: number) {
        const i = Math.floor(index / 4);
        const j = index % 4;
        onCurrentWordChanged(state.word + state.board[i][j]);
        setState((s: any) => {
            if (s.visited[index]) return { ...s };//already visited 
            if (s.cursor.i >= 0) {
                if (!(i === s.cursor.i || i === s.cursor.i - 1 || i === s.cursor.i + 1)
                    || !(j === s.cursor.j || j === s.cursor.j - 1 || j === s.cursor.j + 1))
                    return { ...s };//only neighbours are allowed
            }
            const newVisited = [...s.visited];
            newVisited[index] = true;
            return {
                ...s,
                word: s.word + s.board[i][j],
                path: s.path + index.toString(16),
                visited: newVisited,
                cursor: { i, j }
            };
        });
    }

    function onVisitStart(index: number) {
        if (state.visiting) return;//already on visiting 
        setState((s: any) => {
            const i = Math.floor(index / 4);
            const j = index % 4;
            const newVisited = [...s.visited];
            newVisited[index] = true;
            return {
                ...s,
                word: s.board[i][j],
                path: index.toString(16),
                visited: newVisited,
                cursor: { i, j },
                visiting: true
            };
        });
    }

    function onVisiting(index: number) {
        if (!state.visiting) return;//visiting stream has not been started yet
        onVisit(index);
    }

    function onAdd() {
        if (onWordSubmited(state.path, state.word)) {
            setState(s => {
                return {
                    ...s,
                    cursor: { i: -1, j: -1 },
                    word: "",
                    path: "",
                    visited: Array.from({ length: 16 }, () => false),
                    visiting: false
                };
            });
        }
    }

    return (
        <div className="w-full max-w-4xl flex gap-6">
            <div className="w-full max-w-2xl mb-6">
                <div className="grid grid-cols-4 gap-2 bg-white p-4 rounded-lg shadow-md">
                    {
                        state.board.flat().map(
                            (letter: string, index: number) =>
                            (<BuggleLetter key={index}
                                letter={letter}
                                visited={state.visited[index]}
                                onVisit={() => { }}
                                onVisitStart={() => onVisitStart(index)}
                                onVisitStop={() => onAdd()}
                                onVisiting={() => onVisiting(index)}
                            />))
                    }
                </div>
            </div>
        </div>
    )
}