# AI Integration Endpoint

This endpoint provides a unified interface for interacting with AI services like OpenAI's ChatGPT and Anthropic's Claude through your MCP server.

## Endpoint Details

- **URL**: `/api/ai`
- **Method**: `POST`
- **Content-Type**: `application/json`

## Request Parameters

| Parameter | Type   | Required | Default | Description                                                                                |
|-----------|--------|----------|---------|--------------------------------------------------------------------------------------------|
| message   | string | Yes      | -       | The user's message to send to the AI service                                               |
| provider  | string | No       | openai  | The AI provider to use. Options: `openai` (for ChatGPT) or `claude` (for Claude)           |
| model     | string | No       | gpt-4   | The model to use. Examples: `gpt-4`, `gpt-3.5-turbo`, `claude-3-opus-20240229`, etc.       |

## Response Format

```json
{
  "reply": "The AI's response text",
  "memory": ["array", "of", "conversation", "history"],
  "provider": "The provider that was used (openai or claude)",
  "model": "The model that was used"
}
```

## Environment Variables

The following environment variables need to be set:

- `OPENAI_API_KEY`: Your OpenAI API key (required for OpenAI/ChatGPT)
- `ANTHROPIC_API_KEY`: Your Anthropic API key (required for Claude)
- `OPENAI_API_ENDPOINT` (optional): Custom OpenAI API endpoint (defaults to `https://api.openai.com/v1/chat/completions`)

## Example Usage

### Using with OpenAI/ChatGPT

```javascript
const response = await fetch('/api/ai', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: "What's the weather like today?",
    provider: "openai",
    model: "gpt-4"
  })
});

const data = await response.json();
console.log(data.reply);
```

### Using with Claude

```javascript
const response = await fetch('/api/ai', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: "What's the weather like today?",
    provider: "claude",
    model: "claude-3-opus-20240229"
  })
});

const data = await response.json();
console.log(data.reply);
```

## Testing

You can test this endpoint using the provided test script:

```bash
node test/test-ai-endpoint.js
```

Make sure your server is running locally (`npm run dev`) before running the test.

## Error Handling

The endpoint will return appropriate error messages if:

- The API keys are not configured
- The specified provider is not supported
- There's an error communicating with the AI service

## Integration with MCP

This endpoint can be used alongside the MCP system to provide AI capabilities to your agents. You can call this endpoint from your agent code to get AI-generated responses based on the context.