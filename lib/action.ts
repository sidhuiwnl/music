"use server"

import client from "./redis";
import ytdl from 'ytdl-core';






export async function addToRedis({ id, youtubeLink }: { id: string, youtubeLink: string }) {
    if (!id) {
        throw new Error("Please sign-in for adding to playlist");
    }

    const userKey = `streams:${id}`;
    const allKeys = await client.keys("streams:*");

    // Fetch video metadata
    const info = await ytdl.getInfo(youtubeLink);
    const title = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnail.thumbnails[0].url;

    // Fetch existing YouTube links for the user
    const existingLinks = await client.lRange(userKey, 0, -1);

    // Check if the YouTube link already exists by parsing stored JSON
    for (const stream of existingLinks) {
        const parsedStream = JSON.parse(stream);
        if (parsedStream.youtubeLink === youtubeLink) {
            throw new Error("This YouTube link has already been added.");
        }
    }

    // If no duplicate found, add the new link as a JSON string
    await client.lPush(userKey, JSON.stringify({
        youtubeLink, title, thumbnail
    }));

    // Fetch and return the updated streams for the user
    const streams = await client.lRange(userKey, 0, -1);
    return streams.map(stream => JSON.parse(stream));
}



export async function deleteFromRedis({ id , youtubeLink } : {id : string,youtubeLink : string}) {
    const userKey = `streams:${id}`;

    const existingLinks = await client.lRange(userKey,0,-1);
    
    let found = false;

    for( const item of existingLinks){
        try {
            const parsedItem = JSON.parse(item);

            if(parsedItem.youtubeLink === youtubeLink){
                await client.lRem(userKey,0,item);
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




export async function displayAllVideo(id : string){
    const userKey = `streams:${id}`;
    const existingLinks = await client.lRange(userKey, 0, -1);

    return existingLinks.map(existingLink => JSON.parse(existingLink))

}


export async function deleteTopVideoFromRedis(id  : string){
    const userKey = `streams:${id}`;
    

    const deleteTopValue = await client.lPop(userKey);

    if(deleteTopValue){
        const topDeletedQueues =  await client.lRange(userKey,0,-1);

        return topDeletedQueues.map(topDeletedQueue => JSON.parse(topDeletedQueue))
    }else{
        console.log("empty queue")
    }
}


export async function storeCurrentPlaying({ id,youtubeLink } : { id : string, youtubeLink : string }){
    
    const userKey = `currentPlaying:${id}`;

     await client.set(userKey,JSON.stringify({
        youtubeLink
    }))

}

export async function getCurrentPlaying(id : string){
    const userKey = `currentPlaying:${id}`;

    const currentPlayedVideo = await client.get(userKey);

    if (currentPlayedVideo) {
        return JSON.parse(currentPlayedVideo);
    }

    return null; 
}