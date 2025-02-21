import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { GameSession } from "src/game/schemas/game-session.schema";
import { User } from "src/user/schemas/user.schema";

export type WordSubmissionDocument = HydratedDocument<WordSubmission>;

@Schema()
export class WordSubmission {
    @Prop({ type: mongoose.Schema.ObjectId, ref: 'GameSession' })
    game: GameSession;

    @Prop()
    word: string;

    @Prop({ type: mongoose.Schema.ObjectId, default: false })
    valid: boolean;

    @Prop({ type: mongoose.Schema.ObjectId, ref: 'User' })
    finder: User;

    @Prop()
    dictionary:string;
}

export const WordSubmissionSchema = SchemaFactory.createForClass(WordSubmission);