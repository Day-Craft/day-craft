import emailQueueWorker from "./queues/email.queue";

console.log("Email Queue Worker started");

process.on("SIGTERM", async () => {
  console.info("SIGTERM signal received: closing queues");

  await emailQueueWorker.close();

  console.info("All closed");
});
