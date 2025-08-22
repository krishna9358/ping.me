import { createClient } from "redis";

const redis_url = process.env.REDIS_URL;
const STREAM_NAME = process.env.STREAM_NAME!;

if(!redis_url || !STREAM_NAME){
    throw new Error("REDIS_URL or STREAM_NAME not found in the environment variables");
}

const client = await createClient({
    url: redis_url
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

type WebsiteEvent = {url: string, id: string}

// FUNCTIONS
// Adds a website to the stream
export async function xAdd({url, id} : WebsiteEvent){
    await client.xAdd(
        STREAM_NAME, "*",
        {
            url,
            id
        }
    );
}

// Adds multiple websites to the stream in a bulk
// TODO: Make this function more efficient, instead of for loop there should be some other way to do it. Send in some batch of data
export async function xAddBulk(websites : WebsiteEvent[]) {
    for(let i = 0; i < websites.length ; i++){
        await xAdd({
            url: websites[i].url,
            id: websites[i].id
        });
    }
}

// Read from the stream in a consumer group
export async function xReadGroup(consumerGroup: string, workerId:string): Promise<any>{
    const result = await client.xReadGroup(
        consumerGroup,
        workerId,
        {
            key: STREAM_NAME,
            id: '>' // reads from the last id it read automatically
        },{
            COUNT: 5
        }
    );
    return result;
}

// Sends the ack
export async function xAck(consumerGroup: string, eventId:string){
    const res = await client.xAck(
        STREAM_NAME,
        consumerGroup,
        eventId
    );
    return res;
}


// Sends the bulk ack
export async function xAckBulk(consumerGroup: string, eventIds:string[]) {
    eventIds.map(eventId => {
        xAck(consumerGroup, eventId)
    })
}