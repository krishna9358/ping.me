-- Allow deleting a website without manually removing ticks first.
ALTER TABLE "WebsiteTick" DROP CONSTRAINT "WebsiteTick_websiteId_fkey";

ALTER TABLE "WebsiteTick" ADD CONSTRAINT "WebsiteTick_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
