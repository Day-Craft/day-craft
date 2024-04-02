import connection from '../redis';
import { EMAIL_TASK_QUEUE } from '../../constants';
import { Queue } from 'bullmq';

const emailQueue = new Queue(EMAIL_TASK_QUEUE, {
  connection,
});

export const addEmailJob = async (payload: any) => {
  await emailQueue.add(`${Date.now()}`, payload);
};
