import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/redis";

export async function DELETE(req: NextRequest) {
  const { userId, youtubeLink } = await req.json();

  try {
    
    const particularStreams = await client.lRange("streams", 0, -1);

    
    const finalStreams = particularStreams.filter((particularStream) => {
      const parsedStream = JSON.parse(particularStream);
      return !(parsedStream.userId === userId && parsedStream.youtubeLink === youtubeLink);
    });

   
    await client.del("streams");  
    if (finalStreams.length > 0) {
      await client.rPush("streams", finalStreams.map(stream => JSON.stringify(stream)));
    }

    return NextResponse.json({
      msg: "Video removed successfully",
      finalStreams: finalStreams.map((stream) => JSON.parse(stream)), // Return parsed streams
    });
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
