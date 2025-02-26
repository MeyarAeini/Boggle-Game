import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { GameTeam, GameTeamSchema } from "./game-team.schema";
import { User } from "src/user/schemas/user.schema";
import { GameBoard } from "src/board/schemas/board.schema";

export type GameSessionDocument = HydratedDocument<GameSession>;

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class GameSession {
    @Prop({ type: Types.ObjectId })
    _id: Types.ObjectId;

    @Prop()
    startTime?: Date;

    @Prop()
    endTime?: Date;

    @Prop({ type: Types.ObjectId, ref: "GameBoard" })
    board: GameBoard;

    @Prop({ type: [GameTeamSchema] })
    teams: GameTeam[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    organiser: User;
}

export const GameSessionSchema = SchemaFactory.createForClass(GameSession);