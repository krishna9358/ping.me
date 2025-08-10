import { createClient } from "redis";

const redis_url = process.env.REDIS_URL;

const client = await createClient({
    url: redis_url!
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

type WebsiteEvent = {url: string, id: string}

// FUNCTIONS
// Adds a website to the stream
export async function xAdd({url, id} : WebsiteEvent){
    await client.xAdd(
        'pingme:websites', "*",
        {
            url,
            id
        }
    );
}

// Adds multiple websites to the stream in a bulk
// TODO: Make this function more efficient, instead of for loop there should be some other way to do it.
export async function xAddBulk(websites : WebsiteEvent[]) {
    for(let i = 0; i < websites.length ; i++){
        await xAdd({
            url: websites[i].url,
            id: websites[i].id
        });
    }
}
