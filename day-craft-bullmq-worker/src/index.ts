import emailQueueWorker from "./queues/email.queue";

emailQueueWorker.on('completed', job => {
    console.log(`${job.id} has completed!`);
});

emailQueueWorker.on('failed', (job: any, err) => {
    console.log(`${job.id} has failed with ${err.message}`);
});
