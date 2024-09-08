
interface StreamResponse {
    msg: string;
    streams: string[];
}


export async function youtubeStream({id,link} : {id : string , link : string}){
    const response  = await fetch("/api/streams",{
        method : "POST",
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            youtubeLink : link,
            userId : id
        })
    })

    if(!response.ok){
        throw new Error('Failed to submit the YouTube link');
    }

    const responseData: StreamResponse = await response.json();
    return responseData;
}


