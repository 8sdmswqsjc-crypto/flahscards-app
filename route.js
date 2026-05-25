import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { prompt, numCards } = await req.json()
    
    const anthropicApiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY
    if (!anthropicApiKey) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
      },
      body: JSON.stringify({
        model: 'claude-opus-4-1',
        max_tokens: 2000,
        messages: [
          { role: 'user', content: prompt }
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.error?.message || 'Claude API error' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const responseText = data.content[0].text

    // Etsi JSON
    const jsonMatch = responseText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Could not parse response format' },
        { status: 500 }
      )
    }

    const cards = JSON.parse(jsonMatch[0])
    return NextResponse.json({ cards })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
