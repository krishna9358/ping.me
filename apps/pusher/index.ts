import prismaClient from 'store/client';
import { xAddBulk } from 'redis-custom-client/client'; 

async function main(){
    let websites = await prismaClient.website.findMany({
        where:{
            userId : ""
        },
        select:{
        id:true,
        url:true
        }
    })
    await xAddBulk(websites.map(w=>({url:w.url, id:w.id})));
}


// every three mins to push to to the redis stream
setInterval(()=>{
    main();
}, 3 * 1000 * 60)

main();