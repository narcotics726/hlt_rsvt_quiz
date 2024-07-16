import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDAL } from './users.dal';

@Module({
    providers: [UsersService, UsersDAL],
    exports: [UsersService],
})
export class UsersModule {}
