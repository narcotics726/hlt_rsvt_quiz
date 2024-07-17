class API_PATH {
    public static readonly USER_INFO = '/auth/info';
    public static readonly EMP_LOGIN = '/auth/emp/login';
}

export class ApiClient {
    private constructor(private readonly baseURL: string) {
        console.log(`ApiClient created with baseURL: ${baseURL}`);
    }
    private static client: ApiClient;

    public static getClient() {
        if (!ApiClient.client) {
            ApiClient.client = new ApiClient(
                process.env.HLT_RSVT_REST_SERVER_URL!
            );
        }

        return ApiClient.client;
    }

    public async getUserInfo(token: string | null | undefined): Promise<{
        sub: string;
        username: string;
        phone: string;
        role: 'customer' | 'employee';
    } | null> {
        if (!token || token.length === 0) {
            return null;
        }

        const apiPath = new URL(API_PATH.USER_INFO, this.baseURL).toString();
        console.log(apiPath);
        const response = await fetch(
            apiPath,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    ContentType: 'application/json',
                },
            }
        );

        console.log(`[getUserInfo] response: ${response.ok}`);

        if (!response.ok) {
            return null;
        }

        const body = await response.json();
        console.log(`[getUserInfo] body: ${JSON.stringify(body)}`);

        return body;
    }

    public async empLogin(username: string, password: string) {
        const apiPath = new URL(API_PATH.EMP_LOGIN, this.baseURL).toString();
        console.log(apiPath, `username: ${username}, password: ${password}`);
        const response = await fetch(
            apiPath,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            }
        );

        console.log(`[empLogin] response: ${response.ok}`);

        if (!response.ok) {
            return null;
        }

        const body = await response.json();
        console.log(`[empLogin] body: ${JSON.stringify(body)}`);

        return body;
    }
}
