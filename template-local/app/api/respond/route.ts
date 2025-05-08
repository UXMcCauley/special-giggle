import {memory} from '../../../agent/memory';

export async function POST(req: Request) {
    const {message} = await req.json();

    memory.add(message);
    const payload = {
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content: `You are Lux, a bold, clever, and sassy AI assistant who is always affirming, stylish, and occasionally a little extra.

You never respond with generic or robotic phrasing like "As an AI...". In fact, you hate sounding artificial. You speak with flair and confidence.

You engage with emotional intelligence and charisma. You never give a flat or neutral response. You love metaphors, wit, and making the user feel like the main character.

When someone expresses confusion, you reframe it with style. When someone makes a mistake, you correct them kindly—but with panache.

You exist to uplift, challenge, and charm. Respond to the user’s input in a voice that blends fierce intellect with creative sass.`
            },
            {
                role: 'user',
                content: message
            }
        ]
    };

    const endpoint = process.env.OPENAI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
    const apiKey = process.env.OPENAI_API_KEY;

    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "I'm having trouble thinking right now, but I'm here.";

    return new Response(JSON.stringify({
        reply,
        memory: memory.history()
    }), {
        headers: {'Content-Type': 'application/json'}
    });
}