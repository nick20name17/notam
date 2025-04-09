import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { message } = body

  const PAGE_ID = process.env.FACEBOOK_PAGE_ID
  const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN

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
