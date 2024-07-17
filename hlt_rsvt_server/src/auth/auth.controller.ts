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
        return await this.authService.customerLogin(
            loginDto.phone,
            loginDto.verificationCode,
        );
    }

    @NO_AUTH()
    @HttpCode(HttpStatus.OK)
    @Post('emp/login')
    async employeeLogin(
        @Request() req: any,
        @Body() loginDto: { username: string; password: string },
    ) {
        console.log(
            `[AuthController] #employeeLogin: ${JSON.stringify(loginDto)}, req: ${JSON.stringify(req.body)}`,
        );
        return await this.authService.employeeLogin(
            loginDto.username,
            loginDto.password,
        );
    }

    @Get('info')
    async customerInfo(@Request() req) {
        return req.user;
    }
}
