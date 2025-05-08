import fetch from 'node-fetch';

// Define the token response type
export interface QBTokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    x_refresh_token_expires_in: number;
    realmId?: string;
}

export async function refreshToken(refreshToken: string): Promise<QBTokenResponse> {
    const basicAuth = Buffer.from(
        `${process.env.QB_CLIENT_ID}:${process.env.QB_CLIENT_SECRET}`
    ).toString('base64');

    const response = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to refresh QuickBooks token: ${error["error_description"] || JSON.stringify(error)}`);
    }

    return await response.json() as QBTokenResponse; // Contains new access_token + refresh_token
}
