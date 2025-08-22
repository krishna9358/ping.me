import axios from "axios";
import { xReadGroup, xAck } from "redis-custom-client/client";
import prismaClient from "store/client";

// TODO: make it dynamic , this should be fetched from the database
// TODO: There is no way for now to create consumer group or region from the platform for admin. Do it cli for now, but later make an endpoint.
const REGION_ID = process.env.REGION_ID;
const WORKER_ID = process.env.WORKER_ID;


async function main(){
    while(1){
        // read from the streams
        const response = await xReadGroup(REGION_ID!, WORKER_ID!);

        //process the website and store in db
        // TODO: it should be routed a queue in a bulk db request.
        const promises = response.map(({id,message } : any) =>{
                const url = message.url;
                const websiteId = message.id;
                processWebsiteTick(url, websiteId);
        })
        await Promise.all(promises)
        console.log(promises.length);

        // add ack back to the queue that this event is processed.
        await xAck(REGION_ID!, response.map(({id}:any) => id));

    }
}

async function processWebsiteTick(url: string, websiteId: string){
    return new Promise<void>((resolve, reject) => {
    let startTime = Date.now();
    try {
        axios.get(url)
            .then(async () => {
                const endTime = Date.now();
                await prismaClient.websiteTick.create({
                    data : {
                        response_time_ms : endTime - startTime,
                        websiteId,
                        regionId : REGION_ID!,
                        status: "Up",
                    }
                })
                resolve()
            })
            .catch(async () => {
                const endTime = Date.now();
                await prismaClient.websiteTick.create({
                    data : {
                        response_time_ms : endTime - startTime,
                        websiteId,
                        regionId : REGION_ID!,
                        status: "Down",
                    }
                })
                resolve()
            })

    } catch (error) {
        console.log(error);
        resolve()
    }
})
}

main();