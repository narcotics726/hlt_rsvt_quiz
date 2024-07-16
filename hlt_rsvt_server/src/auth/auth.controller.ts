import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('customer/login')
    async customerLogin(
        @Body() loginDto: { phone: string; verificationCode: string },
    ) {
        console.log(
            `[AuthController] #customerLogin: ${JSON.stringify(loginDto)}`,
        );
        return await this.authService.customerLogin(
            loginDto.phone,
            loginDto.verificationCode,
        );
    }
}
