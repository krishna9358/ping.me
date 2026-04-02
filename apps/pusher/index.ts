import prismaClient from "store/client";
import { xAddBulk } from "redis-custom-client/client";

async function main() {
  let websites = await prismaClient.website.findMany({
    select: {
      id: true,
      url: true,
      regionId: true,
    },
  });
  console.log(websites.length);
  await xAddBulk(websites.map((w) => ({ url: w.url, id: w.id, regionId: w.regionId })));
}

// every 30 seconds to push to the redis stream
setInterval(
  () => {
    main();
  },
  30 * 1000,
);

main();
