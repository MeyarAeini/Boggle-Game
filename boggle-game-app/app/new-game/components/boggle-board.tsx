'use client';

import BuggleLetter from "./boggle-letter";
import { BoardState, BoardPath } from "../../lib/definitions";
import { useState, useEffect } from "react";
import Timer from "./timer";
import useSocket from "../../lib/useSocket";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { getBoard } from "@/app/services/board.service";

export default function BoggleBoard() {
    const { data: session } = useSession({ required: true });
    //board current state
    const [state, setState] = useState<BoardState>(
        {
            board: Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => '')),
            cursor: { i: -1, j: -1 },
            word: "",
            path: "",
            visited: Array.from({ length: 16 }, () => false),
            visiting: false
        });

    //added words
    const [words, setWords] = useState<Map<string, { word: string, exist: boolean }>>(new Map());

    //connect to socket
    const { connected, send, join } = useSocket((data: BoardPath) => {
        if (!data.word || data.word.length == 0 || words.has(data.path)) return;
        setWords(prev => new Map(prev).set(data.path, { word: data.word, exist: false }));
    });

    useEffect(() => {
        join(session?.user?.email ?? "","test");
        const fetchBoard = async ()=>{
            const brd = await getBoard(session?.user?.accessToken);
            setState((prev: BoardState)  => {
                return { ...prev, board: brd ?? [] };
            });
        };

        fetchBoard();
        
    }, [connected]);

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
        if (!state.word || state.word.length == 0 || words.has(state.path)) return;
        send({ path: state.path, word: state.word });
        setWords(prev => new Map(prev).set(state.path, { word: state.word, exist: false }));
        isaword(state.path,state.word);
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

    const API_URL = process.env.DICTIONARY_APP_API_URL || "http://localhost:3003";

    function isaword(path: string, word:string) {
        const checkWord = async () => {
            const response = await fetch(`${API_URL}/dictionary/${word}`);
            const result = await response.json();
            setWords(prev => new Map(prev).set(path, { word: word, exist: result }));
        };

        checkWord();
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                {/* Top Section: Timer and Current Word */}
                <div className="w-full max-w-2xl mb-6">
                    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
                        <div className="text-lg font-semibold">
                            <Timer />
                        </div>
                        <div className="text-lg font-semibold">
                            <span className="text-green-500">{state.word}</span>
                        </div>
                    </div>
                </div>
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
                    {/* Added Words */}
                    <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
                        <ul className="space-y-2 overflow-y-auto" style={{ maxHeight: '270px' }}>
                            {[...words.entries()].map(([path, word]) => (
                                <li key={path} className={clsx("p-2 rounded-md shadow-sm",
                                    {
                                        "bg-gray-50" : !word.exist,
                                        "bg-green-500" : word.exist
                                    }
                                )}>
                                    {word.word}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}