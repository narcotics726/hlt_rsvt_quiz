import { ApolloClient, InMemoryCache } from '@apollo/client';

export class GqlClient {
    private static client: ApolloClient<any>;

    private constructor() {}

    public static getClient() {
        if (!GqlClient.client) {
            GqlClient.client = new ApolloClient({
                uri: process.env.HLT_RSVT_GQL_SERVER_URL,
                cache: new InMemoryCache(),
            });
        }

        return GqlClient.client;
    }
}