import { refreshToken } from './refreshToken';
import { getStoredTokens, saveTokens } from '../../tokenStore';
import QuickBooks from 'node-quickbooks';

export async function getFreshQBClient(userId: string) {
    const tokens = await getStoredTokens(userId);
    const newTokens = await refreshToken(tokens.refresh_token);
    await saveTokens(userId, newTokens);

    return new QuickBooks(
        process.env.QB_CLIENT_ID!,
        process.env.QB_CLIENT_SECRET!,
        newTokens.access_token,
        false,
        newTokens.realmId || tokens.realmId,
        process.env.QB_USE_SANDBOX === 'true',
        true,
        null,
        '2.0',
        newTokens.refresh_token
    );
}
