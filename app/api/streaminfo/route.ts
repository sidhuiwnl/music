import { NextRequest, NextResponse } from "next/server";
import client from '@/lib/redis';

import ytdl from "ytdl-core";

export async function POST(req: NextRequest) {
  const  { youtubeLink,userId } = await req.json();
  const info = await ytdl.getInfo(youtubeLink);
  

  const title  = info.videoDetails.title;
  const thumbnail = info.videoDetails.thumbnail.thumbnails[0].url
  try {

    await client.lPush("videoMetaDatas",JSON.stringify({userId,title,thumbnail}));

    const videMetaData = await client.lRange("videoMetaDatas",0,-1);


    return NextResponse.json(
      {
       videMetaData
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error", error);
    return NextResponse.json(
      {
        msg: "Internal Server error",
      },
      { status: 500 }
    );
  }
}
