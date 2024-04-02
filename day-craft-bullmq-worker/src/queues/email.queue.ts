import { Worker } from "bullmq";
import { EMAIL_TASK_QUEUE, REDIS_SERVER_CONFIG, WORKER_RATE_LIMITER } from "../constants";
import sendEmail from "../consumers/email.consumer";

const emailQueueWorker = new Worker(EMAIL_TASK_QUEUE, async (job) => {
    console.log(`Processing job ${job.id} of type ${job.name}`);

    await sendEmail(
        {
            recipient: job.data.to,
            emailSubject: job.data.subject,
            emailBody: job.data.body
        }
    )
},
{
    connection: REDIS_SERVER_CONFIG,
    limiter: WORKER_RATE_LIMITER,
});

export default emailQueueWorker;
