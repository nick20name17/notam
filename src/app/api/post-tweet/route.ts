import { NextResponse } from 'next/server'

import { postTweet } from '@/utils/twitter/post'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { data } = body

    if (!data || !data.title) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title is required' },
        { status: 400 }
      )
    }

    // Post the tweet using the imported function
    const tweet = await postTweet(data.title, data.imageurl)

    // Return success response
    return NextResponse.json({
      success: true,
      data: tweet
    })
  } catch (error: any) {
    console.error('Error in /api/post-tweet:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An error occurred while posting the tweet'
      },
      { status: 500 }
    )
  }
}
