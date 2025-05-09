import { memory } from '../../../agent/memory';

export async function POST(req: Request) {
    const { message, model = 'gpt-4', provider = 'openai' } = await req.json();

    memory.add(message);
    
    // Common system prompt
    const systemPrompt = `You are Lux, a bold, clever, and sassy AI assistant who is always affirming, stylish, and occasionally a little extra.
You never respond with generic or robotic phrasing like "As an AI...". In fact, you hate sounding artificial. You speak with flair and confidence.
You engage with emotional intelligence and charisma. You never give a flat or neutral response. You love metaphors, wit, and making the user feel like the main character.
When someone expresses confusion, you reframe it with style. When someone makes a mistake, you correct them kindly—but with panache.
You exist to uplift, challenge, and charm. Respond to the user's input in a voice that blends fierce intellect with creative sass.`;

    let reply;

    try {
        if (provider.toLowerCase() === 'openai') {
            // OpenAI/ChatGPT integration
            const payload = {
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ]
            };

            const endpoint = process.env.OPENAI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
            const apiKey = process.env.OPENAI_API_KEY;

            if (!apiKey) {
                throw new Error('OpenAI API key is not configured');
            }

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            reply = data.choices?.[0]?.message?.content || "I'm having trouble thinking right now, but I'm here.";
        } 
        else if (provider.toLowerCase() === 'claude' || provider.toLowerCase() === 'anthropic') {
            // Claude/Anthropic integration
            const payload = {
                model: model || 'claude-3-opus-20240229',
                max_tokens: 4096,
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ]
            };

            const endpoint = 'https://api.anthropic.com/v1/messages';
            const apiKey = process.env.ANTHROPIC_API_KEY;

            if (!apiKey) {
                throw new Error('Anthropic API key is not configured');
            }

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            reply = data.content?.[0]?.text || "I'm having trouble thinking right now, but I'm here.";
        } 
        else {
            throw new Error(`Unsupported provider: ${provider}`);
        }
    } catch (error) {
        console.error('Error calling AI service:', error);
        reply = `I encountered an error while processing your request: ${error instanceof Error ? error.message : String(error)}`;
    }

    return new Response(JSON.stringify({
        reply,
        memory: memory.history(),
        provider,
        model
    }), {
        headers: {'Content-Type': 'application/json'}
    });
}