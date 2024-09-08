"use client";

import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState, useEffect,useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { YT_REGEX } from "@/lib/utils";
import { Button } from "./ui/button";
import { youtubeStream, getVideos } from "@/lib/action";
import Image from "next/image";
import { X, ChevronUp } from "lucide-react";
import YouTubePlayer from 'youtube-player'

interface VideoMetaData {
  userId: string;
  title: string;
  thumbnail: string;
  youtubeLink: string;
}

export default function StreamView({ userId }: { userId: string }) {
  const [youtubeLink, setYoutubeLink] = useState<string | null>(null);
  const [videoMetaDatas, setVideoMetaDatas] = useState<VideoMetaData[]>([]);
  const [currentlyPlaying,setCurrentlyPlaying] = useState<VideoMetaData | null>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const userVideoDetails = async () => {
      const datas = await getVideos({ id: userId });

      setVideoMetaDatas(datas.streams);
    };

    userVideoDetails();
  }, [userId]);

  useEffect(() =>{
    if(currentlyPlaying){
      const player = YouTubePlayer(playerRef.current);
      player.loadVideoById(currentlyPlaying.youtubeLink);
      player.playVideo();

      const eventHandler = (event : {data : number}) =>{
        if(event.data === 0){
          playNext();
        }
      }
      player.on('stateChange', eventHandler)

      return () => {
        player.destroy()
    }

    }
  },[currentlyPlaying])

  async function addtoRedis() {
    if (youtubeLink) {
      try {
        const datas = await youtubeStream({ id: userId, link: youtubeLink });

        const parsedData = datas.streams.map((data) => {
          return JSON.parse(data);
        });

        setVideoMetaDatas(parsedData);
        setYoutubeLink(null);

        if(!currentlyPlaying && parsedData.length > 0){
          setCurrentlyPlaying(parsedData[0]);
          setVideoMetaDatas(videoMetaDatas.slice(1));
        }
        console.log("YouTube link added to queue");
      } catch (error) {
        console.error("Error adding to queue:", error);
      }
    }
  }

  function playNext() {
    if(videoMetaDatas.length > 0){
      try {
        const nextVideo = videoMetaDatas[0];
        setCurrentlyPlaying(nextVideo);
        setVideoMetaDatas(videoMetaDatas.slice(1));
      } catch (error) {
        console.error(error)
      }
    }else{
      setCurrentlyPlaying(null)
    }
    
  }

  return (
    <div className="flex p-4">
      <div className="flex flex-col w-[435px] p-4 space-y-2">
        <Label
          htmlFor="youtube-link"
          className="font-bold font-mono mb-5 text-xl"
        >
          Add Your Favourite Song to be Played
        </Label>
        <Input
          id="youtube-link"
          onChange={(e) => {
            const videoId = e.target.value.match(YT_REGEX);
            videoId ? setYoutubeLink(videoId[1]) : setYoutubeLink(null);
          }}
        />
        <Button onClick={addtoRedis} className="font-mono">
          Add to Queue
        </Button>
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
          <Label className="font-bold font-mono mb-5 text-xl">
            Upcoming Songs
          </Label>
        </div>

        {videoMetaDatas?.map((videoMetaData, index) => (
          <Card className="flex flex-col space-y-4 p-4 min-w-[800px] min-h-[100px] bg-gray-900 border-gray-800 text-white">
            <CardContent key={index} className="flex items-center space-x-4">
              <Image
                src={videoMetaData.thumbnail}
                alt={videoMetaData.title}
                width={100}
                height={100}
                className="rounded-lg"
              />
              <div className="flex flex-col space-y-2 items-start">
                <h1 className="text-lg font-semibold">{videoMetaData.title}</h1>
                <div className="flex flex-row space-x-2">
                  <Button className="w-14" variant="secondary">
                    <X />
                  </Button>
                  <Button className="w-14" variant="secondary">
                    <ChevronUp />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="p-4 space-y-2">
        <Label className="font-bold font-mono mb-5 text-xl">Currently Playing</Label>
        <Card className=" min-w-[400px] min-h-[200px]  bg-gray-900 border-gray-800 text-white">
          <div ref={playerRef}>

          </div>
        </Card>
      </div>
      
    </div>
  );
}



