import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }


    private getPayload(user: any):any {
        return { sub: user.userId, username: user.username, email:user.email };
    }

    async getAccessToken(user: any): Promise<string> {
        const payload = this.getPayload(user);

        return this.jwtService.signAsync(payload);
    }

    async signIn(user: any): Promise<{ access_token: string, refresh_token: string }> {
        const payload = this.getPayload(user);
        return {
            access_token: await this.getAccessToken(payload),
            refresh_token: await this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d'),
            })
        };
    }

    async validateUser(email: string, pass: string) {
        const user = await this.userService.findByEmail(email);
        if (user?.password !== pass)
            return null;

        const { password, ...result } = user;
        return result;
    }

    async validateOAuthUser(usr: any) {
        const user = await this.userService.findByEmail(usr.email);
        if (!user) {
            //create a user record
            return;
        }

        return user;
    }

    async loginOAuth(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
