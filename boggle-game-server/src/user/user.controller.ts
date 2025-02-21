import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegistrationDto } from './dtos/registeration.dto';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @Post()
    async register(@Body() dto: UserRegistrationDto) {
        const user = await this.userService.register(dto);
        const { password, ...result } = user;
        return result;
    }
}
