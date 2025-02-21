import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { GameTeam, GameTeamSchema } from "./game-team.schema";
import { User } from "src/user/schemas/user.schema";

export type GameSessionDocument = HydratedDocument<GameSession>;

@Schema()
export class GameSession {
    @Prop()
    sessionId: string;

    @Prop()
    startTime: Date;

    @Prop()
    endTime?: Date;

    @Prop({type:[GameTeamSchema]})
    teams:GameTeam[];

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'User'})
    organiser: User;
}

export const GameSessionSchema = SchemaFactory.createForClass(GameSession);