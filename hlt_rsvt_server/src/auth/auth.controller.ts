import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { NO_AUTH } from './noAuth.deco';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @NO_AUTH()
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

    @Get('customer/info')
    async customerInfo(@Request() req) {
        return req.user;
    }
}
