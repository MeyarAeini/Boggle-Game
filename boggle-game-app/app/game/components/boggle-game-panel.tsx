'use client';

import BoggleBoard from "./boggle-board";
import { Suspense, useEffect, useState } from "react";
import BoardHeader from "./board-header";
import BoardLeftSide from "./board-left-side";
import BoardRightSide from "./board-right-side";
import BoardFooter from "./board-footer";
import { BoardPath, BoardSolution, GameSession, WordScore } from "@/app/lib/definitions";
import { getSubmittedWords, submitWord } from "@/app/services/game.service";
//import { useSession } from "next-auth/react";
import { useGameState } from "@/app/lib/useGameState";
import { solve_board } from "@/app/services/board.service";

export default function BoggleGamePanel({ gameSession }: { gameSession: GameSession }) {
    //const { data: session } = useSession({ required: true });
    //added words
    const [words, setWords] = useState<Map<string, { word: string, exist: boolean, score: number }>>(new Map());
    const [word, setWord] = useState('');
    const [validWords, setValidWords] = useState<WordScore[]>([]);
    const [totalScore, setTotalScore] = useState(0);
    const [boardSolutions, setBoardSolutions] = useState<BoardSolution>({
        scores: new Map<number, number>(),
        lengths: new Map<number, number>(),
    });

    //connect to socket
    const { gameState } = useGameState();

    useEffect(() => {
        const loadWords = async () => {
            const wrds = await getSubmittedWords(gameSession.sessionId);
            const board_solutions = await solve_board(gameSession.boardId);
            setBoardSolutions(board_solutions);
            setWords((prev) => {
                const newVersion = new Map(prev);
                wrds.forEach((v) => {
                    if (!newVersion.has(v.path))
                        newVersion.set(v.path, { word: v.word, exist: v.valid, score: v.score });
                });
                return newVersion;
            })

        };

        loadWords();
    }, [gameSession]);

    // useEffect(() => {
    //     join(session?.user?.email ?? "", gameSession.sessionId);
    // }, [connected]);

    useEffect(() => {
        const validWords = [...getValidWords()];
        setValidWords(validWords);
        const totalScore = validWords.reduce((acc, current) => acc + current.score, 0);
        setTotalScore(totalScore);
    }, [words]);

    const currentWordChanged = (word: string) => {
        setWord(word);
    }

    const wordSubmitted = (path: string, word: string): boolean => {
        if (!word || word.length == 0 || words.has(path)) return false;

        //send({ path: path, word: word });
        setWords(prev => new Map(prev).set(path, { word: word, exist: false, score: 0 }));
        isaword(path, word);
        return true;
    }

    function isaword(path: string, word: string) {
        const checkWord = async () => {
            const response = await submitWord(gameSession.sessionId, word, path);
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
                <BoardHeader gameSession={gameSession} word={word} score={totalScore} board={boardSolutions} />
            </div>

            {/* Middle section (left, board, right) */}
            <div className="flex flex-1 gap-2 mt-4">
                {/* Left side in the middle left */}
                <div className="w-1/5 bg-white p-6 rounded-lg shadow-md">
                    <BoardLeftSide id={gameSession.sessionId} words={[...words.values()]} />
                </div>

                {/* Board in the middle */}
                <div className="flex-1 bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <BoggleBoard key={gameSession.sessionId}
                            gameId={gameSession.sessionId}
                            board={gameSession.board}
                            onWordSubmited={wordSubmitted}
                            onCurrentWordChanged={currentWordChanged} />
                    </div>
                </div>

                {/* Right side in the middle right */}
                <div className="w-1/5 bg-white p-6 rounded-lg shadow-md">
                    <BoardRightSide id={gameSession.sessionId} words={validWords} />
                </div>
            </div>

            {/* Footer at the bottom */}
            <div className="w-full mt-4">
                <Suspense>
                    <BoardFooter gameSession={gameSession} />
                </Suspense>
            </div>
        </div>
    );
}