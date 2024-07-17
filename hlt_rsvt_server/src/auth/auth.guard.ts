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
import { GqlExecutionContext } from '@nestjs/graphql';

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

    protected getRequest(context: ExecutionContext) {
        return context.switchToHttp().getRequest();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (this.isContextPublic(context)) {
            return true;
        }

        const req =
            this.getRequest(context) ??
            GqlExecutionContext.create(context).getContext().req;
        console.log(
            `[AuthGuard] #canActivate: ${JSON.stringify(req?.headers)}`,
        );
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
