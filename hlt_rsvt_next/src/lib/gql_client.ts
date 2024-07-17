import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { cookies } from 'next/headers';

export class GqlClient {
    private static client: ApolloClient<any>;

    private constructor() {}

    public static getClient() {
        if (!GqlClient.client) {
            const httpLink = createHttpLink({
                uri: process.env.HLT_RSVT_GQL_SERVER_URL,
            });

            const authLink = setContext((_, { headers }) => {
                // get the authentication token from local storage if it exists
                const token = cookies().get('hlt-rsvt.session-token')?.value;
                console.log(`[GqlClient] token: ${token}`);
                // return the headers to the context so httpLink can read them
                return {
                    headers: {
                        ...headers,
                        authorization: token ? `Bearer ${token}` : '',
                    },
                };
            });
            GqlClient.client = new ApolloClient({
                link: authLink.concat(httpLink),
                cache: new InMemoryCache(),
            });
        }

        return GqlClient.client;
    }
}
