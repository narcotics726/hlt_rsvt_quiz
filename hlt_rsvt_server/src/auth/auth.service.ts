import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { getJwtSecret } from './jwt_secret';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersSvc: UsersService,
        private readonly jwtSvc: JwtService,
    ) {}

    async customerLogin(phone: string, verificationCode: string) {
        let user = await this.usersSvc.findCustomerByPhone(phone);

        // #TODO: replace it with a query result from db, somewhere like 'phone_verification_code'
        if (verificationCode !== '000000') {
            throw new UnauthorizedException();
        }

        if (!user) {
            // create a new user
            try {
                user = await this.usersSvc.createNewCustomer(phone);
            } catch (err) {
                console.log(
                    `[AuthService] #customerLogin: ${(err as Error).message} during createNewCustomer with phone ${phone}`,
                );

                throw new UnauthorizedException();
            }
        }

        const jwtPayload = {
            sub: user.id,
            username: user.name,
            phone: user.phone,
            role: 'customer',
        };

        return {
            access_token: await this.jwtSvc.signAsync(jwtPayload, {
                secret: getJwtSecret(),
            }),
        };
    }
}
