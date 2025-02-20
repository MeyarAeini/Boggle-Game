import { Injectable } from '@nestjs/common';
import { User } from './user.models';

@Injectable()
export class UserService {
    private readonly users  = [
        {
            userId : 1,
            username:'admin',
            password:'123456',
            email:'admin@admin.admin',
        }
    ];

    async findOne(username:string):Promise<User|undefined>{
        return this.users.find(it=>it.username===username);
    }

    async findByEmail(email:string):Promise<User|undefined>{
        return this.users.find(it=>it.email===email);
    }
}
