import { AuthGuard } from "@nestjs/passport";

export class LocalGuard extends AuthGuard('local'){};

export class JwtGuard extends AuthGuard('jwt'){};

export class RefreshTokenGuard extends AuthGuard('jwt-refresh'){};