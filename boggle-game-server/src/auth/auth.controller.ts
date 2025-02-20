import { Controller, Post,Get,UseGuards,Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard, LocalGuard, RefreshTokenGuard } from './guards';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @UseGuards(LocalGuard)
    @Post('login')
    login(@Request() req){
        return this.authService.signIn(req.user);
    }

    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    async refresh(@Request() req) {
        const accessToken = await this.authService.getAccessToken(req.user);
        return { accessToken };
    }

    @UseGuards(JwtGuard)
    @Get('profile')
    getProfile(@GetUser() user) {
        return user;
    }
}
