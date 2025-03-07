'use client';

import BoggleBoard from "./boggle-board";
import { Suspense, useEffect, useState } from "react";
import BoardHeader from "./board-header";
import BoardLeftSide from "./board-left-side";
import BoardRightSide from "./board-right-side";
import BoardFooter from "./board-footer";
import { BoardPath, WordScore } from "@/app/lib/definitions";
import useSocket from "@/app/lib/useSocket";
import { submitWord } from "@/app/services/game.service";
import { useSession } from "next-auth/react";

export default function BoggleGamePanel({ gameid, board }: { gameid: string, board: string[][] }) {
    const { data: session } = useSession({ required: true });
    //added words
    const [words, setWords] = useState<Map<string, { word: string, exist: boolean, score: number }>>(new Map());
    const [word, setWord] = useState('');
    const [validWords, setValidWords] = useState<WordScore[]>([]);

    //connect to socket
    const { connected, send, join } = useSocket((data: BoardPath) => {
        if (!data.word || data.word.length == 0 || words.has(data.path)) return;
        setWords(prev => new Map(prev).set(data.path, { word: data.word, exist: false,score:0 }));
    });

    useEffect(() => {
        join(session?.user?.email ?? "", gameid);
    }, [connected]);

    useEffect(() => {
        setValidWords((prev)=>{
            return [...getValidWords()];
        });
    }, [words]);

    const currentWordChanged = (word: string) => {
        setWord(word);
    }

    const wordSubmitted = (path: string, word: string): boolean => {
        if (!word || word.length == 0 || words.has(path)) return false;

        send({ path: path, word: word });
        setWords(prev => new Map(prev).set(path, { word: word, exist: false, score: 0 }));
        isaword(path, word);
        return true;
    }

    function isaword(path: string, word: string) {
        const checkWord = async () => {
            const response = await submitWord(gameid, word, path);
            console.log(`submission response : ${response.score}`);
            setWords(prev => new Map(prev).set(path, { word: word, exist: response.valid, score: response.score }));
        };

        checkWord();
    }

    const getValidWords = (): WordScore[] => {
        return Array.from(words.values()).filter(v => v.exist && v.score > 0).map((it) => (
            {
                word: it.word,
                score: it.score
            }
        ));
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 p-4">
            {/* Header at the top */}
            <div className="w-full">
                <BoardHeader id={gameid} word={word} />
            </div>

            {/* Middle section (left, board, right) */}
            <div className="flex flex-1 gap-2 mt-4">
                {/* Left side in the middle left */}
                <div className="w-1/5 bg-white p-6 rounded-lg shadow-md">
                    <BoardLeftSide id={gameid} words={[...words.values()]} />
                </div>

                {/* Board in the middle */}
                <div className="flex-1 bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <BoggleBoard key={gameid} gameId={gameid} board={board} onWordSubmited={wordSubmitted} onCurrentWordChanged={currentWordChanged} />
                    </div>
                </div>

                {/* Right side in the middle right */}
                <div className="w-1/5 bg-white p-6 rounded-lg shadow-md">
                    <BoardRightSide id={gameid} words={validWords} />
                </div>
            </div>

            {/* Footer at the bottom */}
            <div className="w-full mt-4">
                <Suspense>
                    <BoardFooter id={gameid} />
                </Suspense>
            </div>
        </div>
    );
}