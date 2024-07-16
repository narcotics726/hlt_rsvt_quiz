import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getJwtSecret } from './jwt_secret';
import { Reflector } from '@nestjs/core';
import { NO_AUTH_KEY } from './noAuth.deco';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtSvc: JwtService,
        private readonly reflector: Reflector,
    ) {}

    private isContextPublic(context: ExecutionContext): boolean {
        return this.reflector.getAllAndOverride<boolean>(NO_AUTH_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (this.isContextPublic(context)) {
            return true;
        }

        const req = context.switchToHttp().getRequest();
        const [type, token] = req.headers.authorization?.split(' ') ?? [];
        if (type !== 'Bearer') {
            console.log(
                `[AuthGuard] #canActivate: invalid token type ${type} in ${req.headers.authorization}`,
            );
            throw new UnauthorizedException();
        }

        try {
            const jwtPayload = await this.jwtSvc.verifyAsync(token, {
                secret: getJwtSecret(),
            });
            req.user = jwtPayload;
        } catch (err) {
            console.log(
                `[AuthGuard] #canActivate: ${(err as Error).message} during jwtSvc.verifyAsync with token ${token}`,
            );
            throw new UnauthorizedException();
        }

        return true;
    }
}
