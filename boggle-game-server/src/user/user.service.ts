import { Injectable } from '@nestjs/common';
import { UserRegistrationDto } from './dtos/registeration.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

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
        return usr.save();
    }
}
