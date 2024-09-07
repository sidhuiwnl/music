
import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/redis';  // Import Redis client

export async function POST(req: NextRequest) {
  const { youtubeLink, userId } = await req.json();

  try {
    
    await client.lPush('streams', JSON.stringify({ userId, youtubeLink }));

    const streams = await client.lRange("streams",0,-1);

    return NextResponse.json(
        { msg: 'Submission received and stored.',
          streams
        }
        , { status: 200 });
  } catch (error) {
    console.error('Redis error:', error);
    return NextResponse.json({ msg: 'Error while storing.' }, { status: 500 });
  }
}
