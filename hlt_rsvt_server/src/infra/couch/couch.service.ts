import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as couchbase from 'couchbase';
import { ReservationInput } from 'src/graphql';

@Injectable()
export class CouchService {
    constructor(private readonly configService: ConfigService) {}

    private static _scope: couchbase.Scope;

    public async getScope(scope: string = 'hlt_reservation') {
        if (!CouchService._scope) {
            const client = await couchbase.connect(
                this.configService.get('HLT_RSVT_COUCH_CONNSTR'),
                {
                    username: this.configService.get('HLT_RSVT_COUCH_USERNAME'),
                    password: this.configService.get('HLT_RSVT_COUCH_PASSWORD'),
                },
            );

            CouchService._scope = client.bucket('default').scope(scope);
        }

        return CouchService._scope;
    }

    // #TODO: move them into reservation module

    public async findReservationById(id: string) {
        const result = await CouchService._scope
            .collection('reservations')
            .get(id)
            .catch(() => null);

        if (result && result.content) {
            return {
                ...result.content,
                id,
            };
        }

        return null;
    }

    async findAllReservations(first: number, offset: number) {
        // get from couch with pagination
        const query = `
            SELECT 
                reservations.*, meta(reservations).id AS id 
            FROM reservations ORDER BY id LIMIT $1 OFFSET $2
        `;

        const result = await (
            await this.getScope()
        ).query(query, {
            parameters: [first, offset],
        });

        const queryTotal = `
            SELECT COUNT(1) as total FROM reservations
        `;

        const resultTotal = await CouchService._scope.query(queryTotal);

        const res = {
            totalCount: resultTotal.rows[0].total,
            reservations: result.rows,
        };

        return res;
    }

    public async updateReservation(id: string, rsvt: ReservationInput) {
        const resv = await CouchService._scope
            .collection('reservations')
            .get(id)
            .catch(() => null);

        if (resv) {
            const updated = {
                ...resv.content,
                ...rsvt,
            };
            await CouchService._scope
                .collection('reservations')
                .upsert(id, updated);

            return {
                ...updated,
                id,
            };
        }

        return null;
    }
}
