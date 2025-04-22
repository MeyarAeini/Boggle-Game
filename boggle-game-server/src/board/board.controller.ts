import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { BoardService } from './board.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtGuard } from 'src/auth/guards';

@Controller('board')
export class BoardController {
    constructor(
        private boardService: BoardService
    ) { }

    @UseGuards(JwtGuard)
    @Post()
    async generateBoard(@GetUser('id') id) {
        console.log(`generateBoard : ${id}`);
        const board = await this.boardService.generateBoard(id);
        return board._id;
    }

    @Get('score')
    async getBoardScore(@Query('board') board: string) {
        return this.boardService.getBoardScore(board);
    }

    @Get()
    async geneticGeneration() {
        const sample = await this.boardService.geneticGet();
        return {
            id: sample.id,
            age: sample.age,
            score: sample.score
        };
    }

    @UseGuards(JwtGuard)
    @Get("solve")
    async solve_board(@Query('board') board: string) {
        return await this.boardService.solveBoard(board);
    }
}
