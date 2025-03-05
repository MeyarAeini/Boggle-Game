import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/user/schemas/user.schema";

export type GameBoardDocument = HydratedDocument<GameBoard>

@Schema()
export class GameBoard {
    @Prop({ type: String, unique: true, required: true, _id: true })
    _id: string;

    @Prop({ type: mongoose.Schema.ObjectId, ref: 'User' })
    creator: User;

    @Prop()
    creationDate: Date;

    @Prop({ type: Boolean })
    generated: boolean;

    @Prop({ type: [String] })
    validWords: string[];

    @Prop()
    score: number
}

export const GameBoardSchema = SchemaFactory.createForClass(GameBoard);
