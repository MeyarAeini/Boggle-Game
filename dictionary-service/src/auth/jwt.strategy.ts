import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(configService : ConfigService){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:configService.get<string>('JWT_ACCESS_SECRET') ?? '',
            ignoreExpiration:false,
        });
    }
    async validate(payload:any): Promise<any> {
        return {userId:payload.sub,username:payload.username};
    }

}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){
   
    constructor(configService:ConfigService){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:configService.get<string>('JWT_REFRESH_SECRET')??'',
            ignoreExpiration:false
        });
    }

    async validate(payload:any): Promise<any> {
        return {userId:payload.sub,username:payload.username};
    }

}
