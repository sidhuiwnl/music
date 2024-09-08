import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/redis";

interface StreamResponse {
  msg: string;
  streams: string[];
}

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  try {
    const streams = await client.lRange("streams", 0, -1);

    const userStream = streams
      .map((stream) => JSON.parse(stream))
      .filter((stream) => stream.userId === userId);

    const response: StreamResponse = {
      msg: "Submission received and retrieved",
      streams: userStream,
    };
    return NextResponse.json(response, { status: 200 });
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
