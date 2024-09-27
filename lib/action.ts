"use server";

import client from "./redis";
import ytdl from "ytdl-core";



export async function addToRedis({
  id,
  youtubeLink,
}: {
  id: string;
  youtubeLink: string;
}) {
  if (!id) {
    throw new Error("Please sign-in for adding to playlist");
  }

  const userKey = `streams:${id}`;

  const info = await ytdl.getInfo(youtubeLink);
  const title = info.videoDetails.title;
  const thumbnail = info.videoDetails.thumbnail.thumbnails[0].url;

  const existingLinks = await client.lRange(userKey, 0, -1);

  for (const stream of existingLinks) {
    const parsedStream = JSON.parse(stream);
    if (parsedStream.youtubeLink === youtubeLink) {
      throw new Error("This YouTube link has already been added.");
    }
  }

  await client.lPush(
    userKey,
    JSON.stringify({
      youtubeLink,
      title,
      thumbnail,
      upvotes: 0,
    })
  );

  const streams = await client.lRange(userKey, 0, -1);
  return streams
    .map((stream) => JSON.parse(stream))
    .sort((a, b) => b.upvotes - a.upvotes);
}




export async function deleteFromRedis({
  id,
  youtubeLink,
}: {
  id: string;
  youtubeLink: string;
}) {
  const userKey = `streams:${id}`;

  const existingLinks = await client.lRange(userKey, 0, -1);

  let found = false;

  for (const item of existingLinks) {
    try {
      const parsedItem = JSON.parse(item);

      if (parsedItem.youtubeLink === youtubeLink) {
        await client.lRem(userKey, 0, item);
        console.log(`Removed ${youtubeLink} from ${userKey}`);
        found = true;
        break;
      }
    } catch (error) {
      console.error(`Error parsing JSON: ${error}`);
    }
  }
  if (!found) {
    console.log(`${youtubeLink} not found in ${userKey}`);
  }

  return found;
}

export async function displayAllVideo(id: string) {
  const userKey = `streams:${id}`;
  const existingLinks = await client.lRange(userKey, 0, -1);

  return existingLinks
    .map((existingLink) => JSON.parse(existingLink))
    .sort((a, b) => b.upvotes - a.upvotes);
}

export async function deleteTopVideoFromRedis(id: string) {
  const userKey = `streams:${id}`;

  const videoList = await client.lRange(userKey, 0, -1);

  if (videoList.length > 0) {
    const sortedVideos = videoList
      .map((video) => JSON.parse(video))
      .sort((a, b) => b.upvotes - a.upvotes);

    const topVideo = sortedVideos[0];

    await client.lRem(userKey, 0, JSON.stringify(topVideo));

    const remainingVideos = await client.lRange(userKey, 0, -1);
    return remainingVideos.map((video) => JSON.parse(video));
  } else {
    console.log("empty queue");
    return [];
  }
}

export async function upVoteVideo(id: string, youtubeLink: string) {
  const userKey = `streams:${id}`;

  const videoList = await client.lRange(userKey, 0, -1);

  const updatedList = videoList.map((video) => {
    const videoData = JSON.parse(video);

    if (videoData.youtubeLink === youtubeLink) {
      videoData.upvotes = (videoData.upvotes || 0) + 1;
    }

    return JSON.stringify(videoData);
  });

  await client.del(userKey);

  for (const item of updatedList) {
    await client.rPush(userKey, item);
  }

  const sortedList = updatedList
    .map((video) => JSON.parse(video))
    .sort((a, b) => b.upvotes - a.upvotes);

  return sortedList;
}
