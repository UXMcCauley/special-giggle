// Test script for the AI endpoint
const fetch = require('node-fetch');

async function testAIEndpoint() {
  console.log('Testing AI endpoint...');
  
  // Test with OpenAI
  console.log('\nTesting with OpenAI/ChatGPT:');
  try {
    const openaiResponse = await fetch('http://localhost:3000/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Hello, can you tell me about yourself?',
        provider: 'openai',
        model: 'gpt-4'
      })
    });
    
    const openaiData = await openaiResponse.json();
    console.log('OpenAI Response:', openaiData.reply);
    console.log('Provider:', openaiData.provider);
    console.log('Model:', openaiData.model);
  } catch (error) {
    console.error('Error testing OpenAI:', error);
  }
  
  // Test with Claude
  console.log('\nTesting with Claude/Anthropic:');
  try {
    const claudeResponse = await fetch('http://localhost:3000/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Hello, can you tell me about yourself?',
        provider: 'claude',
        model: 'claude-3-opus-20240229'
      })
    });
    
    const claudeData = await claudeResponse.json();
    console.log('Claude Response:', claudeData.reply);
    console.log('Provider:', claudeData.provider);
    console.log('Model:', claudeData.model);
  } catch (error) {
    console.error('Error testing Claude:', error);
  }
}

// Run the test
testAIEndpoint().catch(console.error);

console.log('\nTo use this endpoint in your application:');
console.log('1. Make a POST request to /api/ai');
console.log('2. Include a JSON body with:');
console.log('   - message: The user\'s message');
console.log('   - provider: "openai" or "claude"');
console.log('   - model: The model to use (e.g., "gpt-4" or "claude-3-opus-20240229")');
console.log('3. Set the following environment variables:');
console.log('   - OPENAI_API_KEY: Your OpenAI API key');
console.log('   - ANTHROPIC_API_KEY: Your Anthropic API key');