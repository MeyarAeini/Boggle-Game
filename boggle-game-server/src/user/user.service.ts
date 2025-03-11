import { Injectable } from '@nestjs/common';
import { UserRegistrationDto } from './dtos/registeration.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.userModel.findOne({ email: email }).exec();
        return user;
    }

    async register(dto: UserRegistrationDto): Promise<User> {
        const usr = new this.userModel(dto);
        usr._id= new Types.ObjectId();
        usr.password = await bcrypt.hash(usr.password, 17);
        return usr.save();
    }

    async  findOne(id: string): Promise<User | null> {
        return this.userModel.findOne({ _id: new mongoose.Types.ObjectId(id) }).exec();
    }
}
