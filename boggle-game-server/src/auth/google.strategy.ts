import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { VerifyCallback } from "jsonwebtoken";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly authService: AuthService,
        configService: ConfigService
    ) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID') ?? "",
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') ?? "",
            callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
            scope: ['email', 'profile']
        });
    }
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { name, emails, photos } = profile;

        const user = {
            email: emails[0].value,
            name: name.givenName + ' ' + name.familyName,
            picture: photos[0].value,
            accessToken,
        };

        // Optionally, save or update the user in the database
        const existingUser = await this.authService.validateOAuthUser(user);

        done(null, existingUser);
    }
}