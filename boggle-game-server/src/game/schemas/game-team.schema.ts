import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/user/schemas/user.schema";

@Schema({_id:false})
export class GameTeam {
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    members: User[];

    @Prop({ type: Boolean, default: false })
    winner: boolean;
}

export const GameTeamSchema = SchemaFactory.createForClass(GameTeam);