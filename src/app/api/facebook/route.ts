import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { message } = body

  const PAGE_ID = '122144807354605872'
  const ACCESS_TOKEN =
    'EAAPiTHc8AG0BOzBFLb52tNAGFYsEzJIIczvYViuFddhqXtSgw4aWckiy8Ii5ZBc4ZBZAiPcZAWPHL4mvc2f6zunYT3ezIjIrZBsW7SwgX3g6PphhHTUcDhV2hsfSk8ambOzjGI0vawTzUZCNyR5wrXVlZChIn2xJp2tXqlfry33NRvkMZAGpCTduriLK7j6nUGHdAetejzuZBMvYUGd6m4V7fSqpEa0YIVlDp'

  try {
    const res = await fetch(`https://graph.facebook.com/${PAGE_ID}/feed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        access_token: ACCESS_TOKEN
      })
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status })
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
