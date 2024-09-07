"use client";

import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { Card } from "./ui/card";
import { YT_REGEX } from "@/lib/utils";
import { Button } from "./ui/button";

export default function StreamView() {
  const [youtubeLink, setYoutubeLink] = useState <string | null>(null);

  return (
    <div className="flex flex-col w-[400px] p-4 space-y-2">
      <Label htmlFor="youtube-link" className="font-bold mb-5 text-xl">Add a song</Label>
      <Input
        id="youtube-link"
        onChange={(e) => {
          const videoId = e.target.value.match(YT_REGEX);
          videoId ? setYoutubeLink(videoId[1]) : setYoutubeLink(null);
        }}
      />
      <Button>Add to Queue</Button>
      <div>
      {youtubeLink && (
        <Card className="bg-black w-[400px] rounded-lg p-3 mt-5">
          <LiteYouTubeEmbed
            id={youtubeLink}
            title={youtubeLink}
          />
        </Card>
      )}
      </div>
    
    </div>
  );
}
