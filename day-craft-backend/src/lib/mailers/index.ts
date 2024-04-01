import { addEmailJob } from '../bullmq';

const sendEmail = async (to: string, subject: string, body: string) => {
  const payload = {
    to,
    subject,
    body,
  };
  await addEmailJob({ payload });
};

export const sendVerificationEmail = async (to: string, verification_code: string) => {
  const subject = 'Verify your email';
  const body = `Your verification code is: ${verification_code}`;
  await sendEmail(to, subject, body);
};

export const sendPasswordResetEmail = async (to: string, reset_code: string) => {
  const subject = 'Reset your password';
  const body = `Your password reset code is: ${reset_code}`;
  await sendEmail(to, subject, body);
};
