import connection from '../redis';
import { Queue } from 'bullmq';

const emailQueue = new Queue('email-jobs', {
  connection,
});

export const addEmailJob = async (payload: any) => {
  await emailQueue.add(`${Date.now()}`, payload);
};
