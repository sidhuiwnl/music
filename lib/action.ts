"use server"

import client from "./redis";
import ytdl from 'ytdl-core';


interface StreamResponse {
    msg: string;
    streams: string[];
}

export async function addToRedis({ id, youtubeLink }: { id: string, youtubeLink: string }) {
    if (!id) {
        throw new Error("Please sign-in for adding to playlist");
    }

    const allKeys = await client.keys("streams:*");

   
    const userKey = `streams:${id}`;

    const info = await ytdl.getInfo(youtubeLink);
    const title  = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnail.thumbnails[0].url;

    const existingLinks = await client.lRange(`streams:${id}`, 0, -1);

    if (existingLinks.includes(youtubeLink)) {
        throw new Error("This YouTube link has already been added.");
    }

    
    await client.lPush(`streams:${id}`, JSON.stringify({
        youtubeLink,title,thumbnail
    }));

    if (allKeys.includes(userKey)) {
        
        const streams = await client.lRange(userKey, 0, -1);
        
        
        return streams.map(stream => JSON.parse(stream));
    } else {
        throw new Error("User not found or no streams available.");
    }


}



// export async function getStreams({ id }: { id: string }) {
   
//     const allKeys = await client.keys("streams:*");

   
//     const userKey = `streams:${id}`;
    
//     if (allKeys.includes(userKey)) {
        
//         const streams = await client.lRange(userKey, 0, -1);
        
        
//         return streams.map(stream => JSON.parse(stream));
//     } else {
//         throw new Error("User not found or no streams available.");
//     }
// }

// export async function youtubeStream({id,link} : {id : string , link : string}){
//     const response  = await fetch("/api/streams",{
//         method : "POST",
//         headers : {
//             'Content-Type' : 'application/json'
//         },
//         body : JSON.stringify({
//             youtubeLink : link,
//             userId : id
//         })
//     })

//     if(!response.ok){
//         throw new Error('Failed to submit the YouTube link');
//     }

//     const responseData: StreamResponse = await response.json();
//     return responseData;
// }

// export async function getVideos( { id } : { id : string}){
//     const response = await fetch("/api/streaminfo",{
//         method : "POST",
//         headers : {
//             'Content-Type' : 'application/json'
//         },
//         body : JSON.stringify({
//             userId : id
//         })
//     })

//     if(!response.ok){
//         throw new Error('Failed to submit the get streams');
//     }

//     return response.json()
// }


// export async function deleteVideoFromQueue({id,link} : {id :string,link : string}){
//     const response = await fetch("/api/deleteVideo",{
//         method : "DELETE",
//         headers: { 'Content-Type': 'application/json' },
//         body : JSON.stringify({
//             userId : id,
//             youtubeLink  : link
//         })
//     })

//     if(!response.ok){
//         throw new Error('Failed to submit the get streams');
//     }

//     return response.json()

// }