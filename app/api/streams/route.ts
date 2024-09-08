
import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/redis';  // Import Redis client
import ytdl from 'ytdl-core';

interface StreamResponse {
  msg: string;
  streams: string[];
}


export async function POST(req: NextRequest) {
  const { youtubeLink, userId } = await req.json();
  const info = await ytdl.getInfo(youtubeLink);

  const title  = info.videoDetails.title;
  const thumbnail = info.videoDetails.thumbnail.thumbnails[0].url
  

  try {
    
    await client.lPush('streams', JSON.stringify({ userId, youtubeLink,title,thumbnail }));

    const streams = await client.lRange("streams",0,-1);

    const response: StreamResponse = {
      msg: 'Submission received and stored.',
      streams: streams,
    };

    return NextResponse.json(
      response,{ status: 200 });
  } catch (error) {
    console.error('Redis error:', error);
    return NextResponse.json({ msg: 'Error while storing.' }, { status: 500 });
  }
}


