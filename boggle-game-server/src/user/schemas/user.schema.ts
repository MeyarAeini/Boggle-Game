import { Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User {
    @Prop({ type: Types.ObjectId })
    _id: Types.ObjectId;

    @Prop()
    email: string;

    @Prop()
    name: string;

    @Prop()
    password: string;

    get id(): string {
        return this._id.toHexString();
    }
}

export const UserSchema = SchemaFactory.createForClass(User);