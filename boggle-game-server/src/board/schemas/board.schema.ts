import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/user/schemas/user.schema";

export type GameBoardDocument = HydratedDocument<GameBoard>

@Schema()
export class GameBoard {
    @Prop({ type: mongoose.Schema.ObjectId, ref: 'User' })
    creator: User;

    @Prop()
    creationDate: Date;

    @Prop()
    value: string;

    @Prop({ type: Boolean })
    generated: boolean;
}

export const GameBoardSchema = SchemaFactory.createForClass(GameBoard);