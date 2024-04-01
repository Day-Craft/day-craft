import { Queue } from 'bullmq';

export const emailQueue = new Queue('email-jobs', {
  connection: {
    host: 'localhost',
    port: 6379,
  },
});

export const addEmailJob = async (payload: any) => {
  await emailQueue.add('send-email', payload);
};
