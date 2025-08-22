import axios from "axios";
import { xReadGroup, xAck } from "redis-custom-client/client";

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
        response.map(({id,message } : any) =>{
                const url = message.url;
                const websiteId = message.id;
                let startTime = Date.now();
                try {
                    axios.get(url)
                        .then(function(){})
                        .catch(function(){})
                } catch (error) {
                    
                }
        })

        // add ack back to the queue that this event is processed.
        await xAck(REGION_ID!, "");

    }
}

main();