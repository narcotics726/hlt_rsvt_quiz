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
}
