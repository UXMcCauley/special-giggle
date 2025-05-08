// Configuration for the application
export const config = {
  // Google Workspace configuration
  googleWorkspace: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/auth/google/callback',
    accessToken: process.env.GOOGLE_ACCESS_TOKEN || '',
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN || '',
    expiresAt: process.env.GOOGLE_TOKEN_EXPIRY ? parseInt(process.env.GOOGLE_TOKEN_EXPIRY) : 0
  },
  
  // QuickBooks configuration
  quickbooks: {
    clientId: process.env.QB_CLIENT_ID || '',
    clientSecret: process.env.QB_CLIENT_SECRET || '',
    accessToken: process.env.QB_ACCESS_TOKEN || '',
    refreshToken: process.env.QB_REFRESH_TOKEN || '',
    realmId: process.env.QB_REALM_ID || '',
    useSandbox: process.env.QB_USE_SANDBOX === 'true',
    debug: process.env.QB_DEBUG === 'true'
  },
  
  // OpenAI configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    apiEndpoint: process.env.OPENAI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions'
  },
  
  // Server configuration
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
    environment: process.env.NODE_ENV || 'development'
  }
};