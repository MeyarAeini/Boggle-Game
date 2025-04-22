'use server';

import { BoardSolution } from "../lib/definitions";
import { query } from "./base.service";

export async function solve_board(board: string): Promise<BoardSolution> {
    try {
        const response = await query(`board/solve?board=${board}`);
        return response.data;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}