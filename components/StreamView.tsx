"use client";


import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

import { Label } from "./ui/label";
import { useState, useEffect, useRef,useCallback } from "react";
import { Card, CardContent } from "./ui/card";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  addToRedis,
  displayAllVideo,
  deleteFromRedis,
  deleteTopVideoFromRedis,
  upVoteVideo,
  
} from "@/lib/action";

import Image from "next/image";
import { X, ChevronUp, Search, Music } from "lucide-react";
import YouTubePlayer from "youtube-player";
import formattedDate from "@/lib/date";


interface VideoMetaData {
  title: string;
  thumbnail: string;
  youtubeLink: string;
  upvotes: number;
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
      console.log(result)
      if (result.length > 0) {
        if (!currentlyPlaying) {
          setCurrentlyPlaying(result[0]);

          const finalStream = await deleteTopVideoFromRedis(userId);
          setVideoMetaDatas(finalStream);
        } else {
          setVideoMetaDatas([...result]);
          toast("Successfully added to redis",{
            description : formattedDate
          })
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

  const playNext = useCallback(async () => {
    if (videoMetaDatas.length > 0) {
      const sortedVideos = [...videoMetaDatas].sort(
        (a, b) => b.upvotes - a.upvotes
      );

      const nextVideo = sortedVideos[0];

      setCurrentlyPlaying(nextVideo);

      const updatedQueue = await deleteTopVideoFromRedis(userId);

      setVideoMetaDatas(updatedQueue);
    } else {
      setCurrentlyPlaying(null);
    }
  },[videoMetaDatas, userId]);

  

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

      const handleVideoStateChange = (event: { data: number }) => {
        if (event.data === 0) {
          playNext();
        }
      };
      player.on("stateChange", handleVideoStateChange);

      return () => {
        player.destroy();
        playerInstanceRef.current = null;
      };
    }
  }, [currentlyPlaying,playNext]);

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const videoId = input.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/
    );
    if (videoId) {
      setYoutubeLink(videoId[1]);
    } else {
      setYoutubeLink("");
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row p-4 space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex flex-col  w-[400px] h-[400px] bg-zinc-900 text-white p-4 rounded-lg ">
          <div className="relative mb-2 ">
            <input
              type="text"
              placeholder="https://www.youtube.com/watch"
              onChange={handleInputChange}
              className="w-full bg-zinc-800 text-white placeholder-zinc-600 py-2 px-4 pr-10 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
            />
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-600"
              size={18}
            />
          </div>

          <div className="bg-zinc-800 h-60 rounded-md flex items-center justify-center mb-2 overflow-hidden">
            {youtubeLink ? (
              <div className="relative w-full h-full">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${youtubeLink}`}
                  title="YouTube video player"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <div className="absolute inset-0 bg-transparent z-10"></div>
              </div>
            ) : (
              <div className="text-center">
                <Music className="mx-auto mb-2 text-zinc-700" size={24} />
                <p className="text-zinc-700 text-sm">No video Added</p>
              </div>
            )}
          </div>

          <button
            onClick={addtolocalRedis}
            className="bg-white text-black font-bold py-2 px-4 rounded-md hover:bg-zinc-200 transition-colors"
          >
            Add to queue
          </button>
        </div>
        <div className="flex flex-col w-full min-w-[400px] max-h-[400px] bg-gradient-to-br from-zinc-800 to-zinc-900 text-white p-6 rounded-xl shadow-lg">
          <Label className="font-bold font-mono mb-6 text-2xl tracking-wider">
            Queue Songs
          </Label>

          <div className="space-y-6 max-h-[400px] overflow-y-auto ">
            {videoMetaDatas.length > 0 ? (
              videoMetaDatas.map((videoMetaData, index) =>
                videoMetaData &&
                videoMetaData.thumbnail &&
                videoMetaData.title ? (
                  <div
                    key={index}
                    className="flex items-center space-x-6 p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-all duration-300"
                  >
                    <Image
                      src={videoMetaData.thumbnail}
                      alt={videoMetaData.title}
                      width={100}
                      height={100}
                      className="rounded-lg shadow-lg transition-transform transform hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-image.jpg"; // Replace with an actual placeholder image path
                      }}
                    />
                    <div className="flex flex-col space-y-1">
                      <h2 className="text-lg font-semibold leading-tight">
                        {videoMetaData.title}
                      </h2>
                      <p className="text-sm text-gray-400 font-semibold">
                        Upvotes: {videoMetaData.upvotes}
                      </p>
                      <div className="flex space-x-3 pt-2">
                        <Button
                          onClick={ async() =>{
                            await deleteFromRedis({
                              id: userId,
                              youtubeLink: videoMetaData.youtubeLink,
                            });
                            toast("The video has been deleted",{
                              description : formattedDate,
                            })
                          }
                            
                          }
                          
                          aria-label="Remove from queue"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                        <Button
                          onClick={async () => {
                            const updatedVideos = await upVoteVideo(
                              userId,
                              videoMetaData.youtubeLink
                            );
                            setVideoMetaDatas(updatedVideos);
                          }}
                          aria-label="Move up in queue"
                        >
                          <ChevronUp className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null
              )
            ) : (
              <div className="text-center">
                <p className="text-gray-400">No upcoming songs in the queue</p>
              </div>
            )}
          </div>
        </div>

        
      </div>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md p-6 space-y-6 bg-zinc-800 rounded-xl shadow-lg">
          <Label className="block text-2xl font-bold text-center text-white">
            Currently Playing
          </Label>
          <Card className="overflow-hidden w-[400px] h-60 rounded-lg bg-zinc-800">
            <CardContent className="p-0 h-full ">
              <div ref={playerRef} className="w-full h-full"></div>
            </CardContent>
          </Card>
          <button
            onClick={playNext}
            className="w-full py-3 text-lg font-semibold text-zinc-900 bg-white rounded-md hover:bg-zinc-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          >
            Play Next
          </button>
        </div>
      </div>
    </>
  );
}
