import { EMAIL_TASK_QUEUE } from "../constants";
import sendEmail from "../consumers/email.consumer";
import connection from "../redis";
import { Worker } from "bullmq";

const emailQueueWorker = new Worker(EMAIL_TASK_QUEUE, async (job) => {
    console.log(`Processing job ${job.id} of type ${job.name}`);

    await sendEmail(
        {
            job_name: job.name,
            recipient: job.data.payload.to,
            emailSubject: job.data.payload.subject,
            emailBody: job.data.payload.body
        }
    )
},
{
    connection,
    limiter: {
        max: 5,
        duration: 1000
    },
});

export default emailQueueWorker;
