# Model Context Protocol (MCP) Server

This repository contains a Next.js application that implements a Model Context Protocol (MCP) server with QuickBooks integration.

## Project Structure

- `/app/api/mcp`: MCP endpoint for processing context through agents
- `/app/api/respond`: Endpoint for handling user interactions
- `/app/api/ai`: Endpoint for interfacing with Claude or ChatGPT
- `/app/api/quickbooks`: QuickBooks-related endpoints
- `/app/agents`: Agent implementations
- `/app/mcp`: MCP type definitions
- `/app/services`: Service implementations

## API Endpoints

### MCP Endpoint

- `GET /api/mcp`: Lists all available agents and their capabilities
- `POST /api/mcp`: Processes a context through all agents and returns the updated context and operations

Example request:
```json
{
  "context": {
    "financial_query": "Show me my invoices from last month"
  }
}
```

Example response:
```json
{
  "context": {
    "financial_query": "Show me my invoices from last month",
    "invoices": [],
    "financial_analysis": {}
  },
  "operations": ["..."]
}
```

### Respond Endpoint

- `POST /api/respond`: Handles user messages and returns AI responses

Example request:
```json
{
  "message": "What were my highest sales last year?"
}
```

### AI Endpoint

- `POST /api/ai`: Interfaces with Claude or ChatGPT and returns AI responses

Example request:
```json
{
  "message": "What were my highest sales last year?",
  "provider": "openai",
  "model": "gpt-4"
}
```

Example request for Claude:
```json
{
  "message": "What were my highest sales last year?",
  "provider": "claude",
  "model": "claude-3-opus-20240229"
}
```

For detailed documentation, see [AI Endpoint README](/app/api/ai/README.md)

### QuickBooks Endpoints

- `GET /api/quickbooks/accounts`: Retrieves QuickBooks accounts
- `GET /api/quickbooks/invoices/late`: Retrieves late invoices
- `GET /api/quickbooks/reports/pnl`: Retrieves profit and loss reports
- `GET /api/quickbooks/reports/quarterly-summary`: Retrieves quarterly summary reports

## Deployment

This application is configured for deployment on Vercel.

### Prerequisites

1. A Vercel account
2. OpenAI API key
3. Anthropic API key (for Claude integration)
4. QuickBooks API credentials (for production use)

### Deployment Steps

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Set up environment variables in Vercel:
   ```
   vercel secrets add openai-api-key "your-openai-api-key"
   vercel secrets add openai-api-endpoint "https://api.openai.com/v1/chat/completions"
   vercel secrets add anthropic-api-key "your-anthropic-api-key"
   ```

   For QuickBooks integration, add the following secrets:
   ```
   vercel secrets add qb-client-id "your-quickbooks-client-id"
   vercel secrets add qb-client-secret "your-quickbooks-client-secret"
   vercel secrets add qb-refresh-token "your-quickbooks-refresh-token"
   vercel secrets add qb-realm-id "your-quickbooks-realm-id"
   vercel secrets add qb-use-sandbox "true" # or "false" for production
   ```

   Note: The application is designed to work in read-only environments like Vercel. Token storage will automatically fall back to environment variables if the filesystem is not writable.

4. Deploy the application:
   ```
   vercel
   ```

5. For production deployment:
   ```
   vercel --prod
   ```

## Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file with the following variables:
   ```
   OPENAI_API_KEY=your-openai-api-key
   OPENAI_API_ENDPOINT=https://api.openai.com/v1/chat/completions
   ANTHROPIC_API_KEY=your-anthropic-api-key
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Access the application at http://localhost:3000

## Testing UI with Device and Vocal Input

The application includes a user-friendly interface for testing your MCP agent with both text and voice input:

### Features

- **Voice Input**: Use the microphone button to speak directly to your agent
- **Device Selection**: Choose from available audio input devices
- **Personality Selection**: Switch between different agent personalities (Pragmatist, Sassy, Innocent)
- **Visual Feedback**: See when voice recognition is active
- **Memory Display**: View the agent's memory of past interactions

### Using Voice Input

1. Open the application in a supported browser (Chrome, Edge, or Safari recommended)
2. Select your preferred audio input device from the dropdown
3. Click the microphone button to start speaking
4. Speak clearly into your microphone
5. The text will appear in the input field as you speak
6. Click the microphone button again to stop recording or click Send to submit your message

### Browser Compatibility

Voice input requires the Web Speech API, which is supported in:
- Google Chrome
- Microsoft Edge
- Safari
- Some versions of Firefox

The application will automatically detect if your browser supports speech recognition and display a status message.

## Testing

### Testing the MCP Endpoint

1. Start the development server:
   ```
   npm run dev
   ```

2. In a separate terminal, run the test script:
   ```
   npm run test:mcp
   ```

This will test both the GET and POST endpoints of the MCP server and display the results.

### Testing the AI Endpoint

1. Start the development server:
   ```
   npm run dev
   ```

2. In a separate terminal, run the test script:
   ```
   npm run test:ai
   ```

This will test the AI endpoint with both OpenAI and Claude providers and display the responses.
