import emailQueueWorker from "./queues/email.queue";

process.on("SIGTERM", async () => {
  console.info("SIGTERM signal received: closing queues");

  await emailQueueWorker.close();

  console.info("All closed");
});
