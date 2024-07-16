import { BaseDAL } from 'src/infra/base.dal';

export interface CustomerUser {
    id: string;
    phone: string;
    name: string;
}

export class UsersDAL extends BaseDAL {
    async findCustomerByPhone(phone: string): Promise<CustomerUser | null> {
        const sql = `
            SELECT customers.*, meta(customers).id AS id FROM customers WHERE customers.phone = $1
        `;

        const result = await (
            await this.couchService.getScope()
        ).query<CustomerUser>(sql, {
            parameters: [phone],
        });

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0];
    }

    async createNewCustomer(phone: string) {
        const existed = await this.findCustomerByPhone(phone);
        if (existed) {
            throw new Error('user existed');
        }

        const newCustomer = {
            phone,
            name: 'New Customer',
        };

        const scope = await this.couchService.getScope();
        const id = 'customer::' + Date.now();

        await scope.collection('customers').upsert(id, newCustomer);

        return {
            ...newCustomer,
            id,
        } as CustomerUser;
    }
}
