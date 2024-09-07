"use client";

import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { YT_REGEX } from "@/lib/utils";
import { Button } from "./ui/button";
import { videoInfo, youtubeStream } from "@/lib/action";
import Image from "next/image";
import { thumbnail } from "ytdl-core";

export default function StreamView({ userId }: { userId: string }) {
  const [youtubeLink, setYoutubeLink] = useState<string | null>(null);
  const [videoMetaDatas, setVideoMetaDatas] = useState<
    { title: string; thumbnail: string }[]
  >([]);

  useEffect(() => {
    console.log(videoMetaDatas);
  }, [videoMetaDatas]);

  async function addtoRedis() {
    if (youtubeLink) {
      try {
        const response = await youtubeStream({ id: userId, link: youtubeLink });
        const videoDetail = await videoInfo({ link: youtubeLink });

        // Add the new video metadata to the state array
        setVideoMetaDatas((prevData) => [...prevData, videoDetail]);

        console.log("YouTube link added to queue");
      } catch (error) {
        console.error("Error adding to queue:", error);
      }
    }
  }

  return (
    <div className="flex p-4">
      <div className="flex flex-col w-[435px] p-4 space-y-2">
        <Label htmlFor="youtube-link" className="font-bold mb-5 text-xl">
          Add a song
        </Label>
        <Input
          id="youtube-link"
          onChange={(e) => {
            const videoId = e.target.value.match(YT_REGEX);
            videoId ? setYoutubeLink(videoId[1]) : setYoutubeLink(null);
          }}
        />
        <Button onClick={addtoRedis}>Add to Queue</Button>
        <div>
          {youtubeLink && (
            <Card className="bg-black w-[400px] rounded-lg p-3 mt-5">
              <LiteYouTubeEmbed id={youtubeLink} title={youtubeLink} />
            </Card>
          )}
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div>
          <Label className="font-bold mb-5 text-xl">Upcoming Songs</Label>
        </div>
        <Card className="flex flex-col space-y-4 p-4 min-w-[800px] min-h-[100px] bg-gray-900 border-gray-800 text-white">
          {videoMetaDatas?.map((videoMetaData, index) => (
            <CardContent key={index} className="flex items-center space-x-4">
              <Image
                src={videoMetaData.thumbnail}
                alt={videoMetaData.title}
                width={100}
                height={100}
                className="rounded-lg"
              />
              <h1 className="text-lg font-semibold">{videoMetaData.title}</h1>
            </CardContent>
          ))}
        </Card>
      </div>
    </div>
  );
}
