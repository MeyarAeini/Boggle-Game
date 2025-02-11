'use client';

import BuggleLetter from "./boggle-letter";
import { getBoard } from "../lib/randomBoardGenerator";
import { BoardState } from "../lib/definitions";
import { useState, useEffect } from "react";
import PreviousMap_ from "postcss/lib/previous-map";

export default function BoggleBoard() {
    //board current state
    const [state, setState] = useState<BoardState>(
        {
            board: Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => '')),
            cursor: { i: -1, j: -1 },
            word: "",
            path: "",
            visited: Array.from({ length: 16 }, () => false)
        });

    //added words
    const [words, setWords] = useState<Map<string, string>>(new Map());

    useEffect(() => {
        setState((prev: BoardState) => {
            return { ...prev, board: getBoard() }
        })
    }, []);

    function onVisit(index: number) {
        const i = Math.floor(index / 4);
        const j = index % 4;
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
                word: [...s.word, s.board[i][j]],
                path: [...s.path, index.toString(16)],
                visited: newVisited,
                cursor: { i, j }
            };
        });
    }

    function onAdd() {
        if (!state.word || state.word.length == 0 || words.has(state.path)) return;
        setWords(prev => new Map(prev).set(state.path, state.word));
        setState(s => {
            return {
                ...s, 
                cursor: { i: -1, j: -1 },
                word: "",
                path: "",
                visited: Array.from({ length: 16 }, () => false)
            };
        });
    }

    return (
        <>
            <div className="grid grid-cols-4 gap-2">
                {
                    state.board.flat().map(
                        (letter: string, index: number) =>
                            (<BuggleLetter letter={letter} key={index} visited={state.visited[index]} onVisit={() => onVisit(index)} />))
                }
            </div>
            <div>
                current word : {state.word}
            </div>
            <button onClick={onAdd} className="w-16 h-16 bg-green-500 flex items-center justify-center text-xl font-bold text-white rounded-lg shadow-md">Add</button>
            <div>
                current path : {state.path}
            </div>
            <div>
                <div>added words</div>
                <ul>
                    {[...words.entries()].map(([path, word]) => {
                        return (<li key={path}>{word}</li>)
                    })}
                </ul>
            </div>

        </>
    )
}