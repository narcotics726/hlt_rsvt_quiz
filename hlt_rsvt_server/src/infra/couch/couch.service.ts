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

            CouchService._scope = client.bucket('hlt').scope(scope);
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

    async findAllReservations(
        first: number,
        offset: number,
        timeRange?: { from?: string; until?: string },
        status?: string,
    ) {
        const args: unknown[] = [first, offset];
        const conditions = [];
        if (timeRange?.from) {
            args.push(timeRange.from);
            conditions.push(`time >= $${args.length}`);
        }

        if (timeRange?.until) {
            args.push(timeRange.until);
            conditions.push(`time <= $${args.length}`);
        }

        if (status) {
            args.push(status);
            conditions.push(`status = $${args.length}`);
        }

        const conditionsStr = conditions.length
            ? `WHERE ${conditions.join(' AND ')}`
            : '';

        // get from couch with pagination
        const query = `
            SELECT 
                reservations.*, meta(reservations).id AS id 
            FROM reservations 
            ${conditionsStr}
            ORDER BY id LIMIT $1 OFFSET $2
        `;
        console.log(query, JSON.stringify(args));
        const result = await (
            await this.getScope()
        ).query(query, {
            parameters: args,
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

    public static async initDb() {
        const cluster = await couchbase.connect(
            process.env.HLT_RSVT_COUCH_CONNSTR!,
            {
                username: process.env.HLT_RSVT_COUCH_USERNAME!,
                password: process.env.HLT_RSVT_COUCH_PASSWORD!,
            },
        );
        const bucket = await cluster
            .buckets()
            .getBucket('hlt')
            .catch(() => null);
        if (!bucket) {
            await cluster.buckets().createBucket({
                name: 'hlt',
                ramQuotaMB: 100,
                bucketType: couchbase.BucketType.Couchbase,
            });
        }

        // not sure why, but sometimes the bucket and scope are not ready at once
        await new Promise((resolve) => setTimeout(resolve, 500));
        await cluster.query(
            'CREATE SCOPE default:`hlt`.hlt_reservation IF NOT EXISTS',
        );
        await new Promise((resolve) => setTimeout(resolve, 500));

        const scope = cluster.bucket('hlt').scope('hlt_reservation');

        await scope.query('CREATE COLLECTION reservations IF NOT EXISTS');
        await scope.query('CREATE COLLECTION customers IF NOT EXISTS');
    }
}
