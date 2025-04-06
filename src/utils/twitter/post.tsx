// src/lib/twitter.ts
import axios from 'axios'
import { promises as fs } from 'fs'
import os from 'os'
import path from 'path'
import { TwitterApi } from 'twitter-api-v2'

// Create a client instance using environment variables
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY as string,
  appSecret: process.env.TWITTER_API_SECRET as string,
  accessToken: process.env.TWITTER_ACCESS_TOKEN as string,
  accessSecret: process.env.TWITTER_ACCESS_SECRET as string
})

// Helper function to download image from URL
async function downloadImage(url: string): Promise<string> {
  try {
    // Generate a temporary file path
    const tempDir = os.tmpdir()
    const randomName = `image-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
    const imagePath = path.join(tempDir, `${randomName}.jpg`)

    // Download the image
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer'
    })

    // Save the image to temp directory
    await fs.writeFile(imagePath, response.data)

    return imagePath
  } catch (error) {
    console.error('Error downloading image:', error)
    throw new Error(`Failed to download image from ${url}`)
  }
}

export async function postTweet(text: string, imageUrl?: string) {
  try {
    let mediaId

    if (imageUrl) {
      // Download the image first if it's a URL
      const localImagePath = await downloadImage(imageUrl)

      // Upload the local image to Twitter
      mediaId = await client.v1.uploadMedia(localImagePath)

      // Clean up the temp file
      await fs
        .unlink(localImagePath)
        .catch((err) => console.warn('Failed to delete temp image file:', err))
    }

    // Post the tweet
    const tweet = await client.v2.tweet({
      text,
      media: mediaId ? { media_ids: [mediaId] } : undefined
    })

    return tweet
  } catch (error) {
    console.error('Error posting to Twitter:', error)
    throw error
  }
}
