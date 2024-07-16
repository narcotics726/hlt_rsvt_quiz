import { Injectable } from '@nestjs/common';
import { UsersDAL } from './users.dal';

@Injectable()
export class UsersService {
    constructor(private readonly usersDAL: UsersDAL) {}

    async findCustomerByPhone(phone: string) {
        return this.usersDAL.findCustomerByPhone(phone);
    }

    createNewCustomer(phone: string) {
        return this.usersDAL.createNewCustomer(phone);
    }
}
