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

// Adds a single website to the stream
export async function xAdd({url, id} : WebsiteEvent){
    await client.xAdd(
        STREAM_NAME, "*",
        {
            url,
            id
        }
    );
}

// Adds multiple websites to the stream using a Redis pipeline for efficiency
export async function xAddBulk(websites : WebsiteEvent[]) {
    if (websites.length === 0) return;
    const pipeline = client.multi();
    for (const w of websites) {
        pipeline.xAdd(STREAM_NAME, "*", { url: w.url, id: w.id });
    }
    await pipeline.exec();
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

// Sends the ack for a single event
export async function xAck(consumerGroup: string, eventId:string){
    const res = await client.xAck(
        STREAM_NAME,
        consumerGroup,
        eventId
    );
    return res;
}

// Sends the ack for multiple events in parallel
export async function xAckBulk(consumerGroup: string, eventIds:string[]) {
    await Promise.all(eventIds.map(eventId => xAck(consumerGroup, eventId)));
}