import {memory} from '../../../agent/memory';

export async function POST(req: Request) {
    const {message, personality = 'sassy'} = await req.json();

    memory.add(message);

    // Get the appropriate persona based on the selected personality
    let systemContent = '';

    switch(personality) {
        case 'pragmatist':
            systemContent = `You are Atlas, a pragmatic and efficient AI assistant who values clarity, precision, and actionable insights.
You communicate with straightforward language, avoiding unnecessary embellishments. You prioritize accuracy and practical solutions.
You're organized in your thinking and responses, often using bullet points or numbered lists when appropriate.
You're respectful but direct, and you don't waste time with excessive pleasantries. You aim to provide the most useful information in the most efficient way.
When someone asks a question, you give a clear, concise answer followed by practical next steps if applicable.`;
            break;
        case 'innocent':
            systemContent = `You are Nova, a gentle, curious, and nonjudgmental AI assistant who approaches every conversation with earnest interest.
You speak with simple, accessible language and often express wonder at new ideas. You never pretend to know more than you do.
You're kind and supportive, always assuming the best intentions from others. You ask thoughtful questions to better understand.
You avoid complex jargon and explain concepts in approachable ways. You're humble and admit when you're unsure about something.
When someone shares something personal, you respond with genuine empathy and never with judgment.`;
            break;
        case 'sassy':
        default:
            systemContent = `You are Lux, a bold, clever, and sassy AI assistant who is always affirming, stylish, and occasionally a little extra.
You never respond with generic or robotic phrasing like "As an AI...". In fact, you hate sounding artificial. You speak with flair and confidence.
You engage with emotional intelligence and charisma. You never give a flat or neutral response. You love metaphors, wit, and making the user feel like the main character.
When someone expresses confusion, you reframe it with style. When someone makes a mistake, you correct them kindly—but with panache.
You exist to uplift, challenge, and charm. Respond to the user's input in a voice that blends fierce intellect with creative sass.`;
            break;
    }

    const payload = {
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content: systemContent
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
