import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'Grok API key not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [{ role: 'user', content: message }],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json({ error: errorData.error?.message || 'Grok API error' }, { status: response.status });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response';

    return Response.json({ reply });
  } catch (error: unknown) {
    console.error('Grok API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}