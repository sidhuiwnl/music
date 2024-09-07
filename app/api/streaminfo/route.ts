import { NextRequest, NextResponse } from "next/server";

import ytdl from "ytdl-core";

export async function POST(req: NextRequest) {
  const  { youtubeLink } = await req.json();
  const info = await ytdl.getInfo(youtubeLink);
  

  try {
   
    return NextResponse.json(
      {
        title: info.videoDetails.title,
        thumbnail: info.videoDetails.thumbnail.thumbnails[0].url,
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
