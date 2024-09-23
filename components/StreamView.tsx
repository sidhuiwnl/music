"use client";

import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "./ui/card";
import { YT_REGEX } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  addToRedis,
  displayAllVideo,
  deleteFromRedis,
  deleteTopVideoFromRedis,
  upVoteVideo
} from "@/lib/action";

import Image from "next/image";
import { X, ChevronUp } from "lucide-react";
import YouTubePlayer from "youtube-player";

interface VideoMetaData {
  title: string;
  thumbnail: string;
  youtubeLink: string;
  upvotes : number
}

interface YouTubePlayerInstance {
  loadVideoById: (videoId: string) => void;
  playVideo: () => void;
  destroy: () => void;
  on: (event: string, listener: (event: { data: number }) => void) => void;
}

export default function StreamView({ userId }: { userId: string }) {
  
  const [youtubeLink, setYoutubeLink] = useState<string | null>(null);

  const [videoMetaDatas, setVideoMetaDatas] = useState<VideoMetaData[]>([]);

  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<YouTubePlayerInstance | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] =
    useState<VideoMetaData | null>(null);

  async function addtolocalRedis() {
    if (!youtubeLink) {
      throw new Error("add some videos to view");
    }

    try {
      const result = await addToRedis({ id: userId, youtubeLink: youtubeLink });
      if (result.length > 0) {
        if (!currentlyPlaying) {
          setCurrentlyPlaying(result[0]);
         
          const finalStream = await deleteTopVideoFromRedis(userId);
          setVideoMetaDatas(finalStream);
        } else {
          setVideoMetaDatas([ ...result]);
        }
      }

      setYoutubeLink(null);
    } catch (error) {
      console.error("Error adding video:", error);
    }
  }

  

  
  useEffect(() => {
    async function fetchingAllVideoFirst() {
      const existingLinks = await displayAllVideo(userId);
      setVideoMetaDatas(existingLinks);

      
    }



    fetchingAllVideoFirst();
  }, [userId]);

  

  useEffect(() => {
    if (currentlyPlaying && playerRef.current) {
      if (!playerInstanceRef.current) {
        playerInstanceRef.current = YouTubePlayer(
          playerRef.current
        ) as YouTubePlayerInstance;
      }

      const player = playerInstanceRef.current;
      player.loadVideoById(currentlyPlaying.youtubeLink);
      player.playVideo();

     

      const handleVideoStateChange = (event : { data : number }) => {
        if(event.data === 0){
          playNext();
        }
      }
      player.on("stateChange", handleVideoStateChange);

      return () => {
               player.destroy();
               playerInstanceRef.current = null;
      };

    }
  }, [currentlyPlaying]);



  const playNext = async() =>{
    if(videoMetaDatas.length > 0){
      const sortedVideos = [...videoMetaDatas].sort((a, b) => b.upvotes - a.upvotes);

      const nextVideo = sortedVideos[0];
      
      setCurrentlyPlaying(nextVideo);

      const updatedQueue = await deleteTopVideoFromRedis(userId);
      
      setVideoMetaDatas(updatedQueue);

    }else{
      setCurrentlyPlaying(null)
    }
  }

 

  return (
    <div className="flex flex-col md:flex-row p-4 space-y-4 md:space-y-0 md:space-x-4">
      <div className="flex flex-col w-full md:w-[435px] p-4 space-y-2">
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
        <Button onClick={addtolocalRedis} className="font-mono">
          Add to Queue
        </Button>

        {youtubeLink && (
          <Card className="bg-black w-full rounded-lg p-3 mt-5">
            <LiteYouTubeEmbed id={youtubeLink} title={youtubeLink} />
          </Card>
        )}
      </div>

      <div className="flex flex-col w-full md:w-auto p-4 space-y-2">
        <Label className="font-bold font-mono mb-5 text-xl">
          Upcoming Songs
        </Label>
        <Card className="flex flex-col space-y-4 p-4 w-full md:min-w-[400px] min-h-[100px] bg-gray-900 border-gray-800 text-white">
          {videoMetaDatas.length > 0 ? (
            videoMetaDatas.map((videoMetaData, index) =>
              videoMetaData &&
              videoMetaData.thumbnail &&
              videoMetaData.title ? (
                <CardContent
                  key={index}
                  className="flex items-center space-x-4"
                >
                  <Image
                    src={videoMetaData.thumbnail}
                    alt={videoMetaData.title}
                    width={100}
                    height={100}
                    className="rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-image.jpg"; // Replace with an actual placeholder image path
                    }}
                  />
                  <div className="flex flex-col space-y-2 items-start">
                    <h2 className="text-lg font-semibold">
                      {videoMetaData.title}
                    </h2>
                    <p className="text-sm t text-white">Upvotes: {videoMetaData.upvotes}</p>
                    <div className="flex flex-row space-x-2">
                      <Button
                        onClick={() =>
                          deleteFromRedis({
                            id: userId,
                            youtubeLink: videoMetaData.youtubeLink,
                          })
                        }
                        className="w-14"
                        variant="secondary"
                        aria-label="Remove from queue"
                      >
                        <X />
                      </Button>
                      <Button
                        className="w-14"
                        variant="secondary"
                        aria-label="Move up in queue"
                        onClick={ async() =>{
                          const updatedVideos = await upVoteVideo(userId, videoMetaData.youtubeLink);
                          setVideoMetaDatas(updatedVideos);
                        }}
                      >
                        <ChevronUp />
                        
                      </Button>
                      
                    </div>
                  </div>
                </CardContent>
              ) : null
            )
          ) : (
            <CardContent>
              <p className="text-white">No upcoming songs in the queue</p>
            </CardContent>
          )}
        </Card>
      </div>
      <div className="flex flex-col w-full md:w-auto p-4 space-y-2">
        <Label className="font-bold font-mono mb-5 text-xl">
          Currently Playing
        </Label>
        <Card className="w-full md:min-w-[400px] min-h-[200px] rounded bg-gray-900 border-gray-800 text-white">
          <CardContent>
            <div ref={playerRef}></div>
          </CardContent>
        </Card>
        <Button onClick={playNext}>Play Next</Button>
      </div>
      

      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}
