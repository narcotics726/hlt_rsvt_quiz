import * as couchbase from 'couchbase';

export class Couch {
    private static instance: couchbase.Scope;

    private constructor() {}

    public static async getScope(): Promise<couchbase.Scope> {
        if (!Couch.instance) {
            const cluster = await couchbase.connect(
                process.env.HLT_RSVT_COUCH_CONNSTR!,
                {
                    username: process.env.HLT_RSVT_COUCH_USERNAME!,
                    password: process.env.HLT_RSVT_COUCH_PASSWORD!,
                }
            );

            Couch.instance = cluster.bucket('hlt').scope('hlt_reservation');
        }

        return Couch.instance;
    }

    public static async initDb() {
        const cluster = await couchbase.connect(
            process.env.HLT_RSVT_COUCH_CONNSTR!,
            {
                username: process.env.HLT_RSVT_COUCH_USERNAME!,
                password: process.env.HLT_RSVT_COUCH_PASSWORD!,
            }
        );
        let bucket = await cluster
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
        await cluster.query('CREATE SCOPE default:`hlt`.hlt_reservation IF NOT EXISTS');
        const scope = cluster.bucket('hlt').scope('hlt_reservation');

        await scope.query('CREATE COLLECTION reservations IF NOT EXISTS');
        await scope.query('CREATE COLLECTION customers IF NOT EXISTS');
    }
}
