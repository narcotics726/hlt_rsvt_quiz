import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as couchbase from 'couchbase';

@Injectable()
export class CouchService {
    constructor(private readonly configService: ConfigService) {}

    private static _scope: couchbase.Scope;

    async init() {
        if (!CouchService._scope) {
            const client = await couchbase.connect(
                this.configService.get('HLT_RSVT_COUCH_CONNSTR'),
                {
                    username: this.configService.get('HLT_RSVT_COUCH_USERNAME'),
                    password: this.configService.get('HLT_RSVT_COUCH_PASSWORD'),
                },
            );

            CouchService._scope = client
                .bucket('default')
                .scope('hlt_reservation');
        }
    }

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
            FROM reservations LIMIT $1 OFFSET $2
        `;

        const result = await CouchService._scope.query(query, {
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

        console.log(JSON.stringify(res));

        return res;
    }
}
