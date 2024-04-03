import nodemailer from "nodemailer";
import { EMAIL_FROM, EMAIL_PASSWORD, EMAIL_USER } from "../constants";

interface EmailPayload {
    job_name: string;
    recipient: string;
    emailSubject: string;
    emailBody: string;
}

const emailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
    },
});

const sendEmail = async (payload: EmailPayload) => {
    try {
        const { recipient, emailSubject, emailBody } = payload;
        console.log(`Sending email to ${recipient}`);
        await emailTransporter.sendMail({
            from: EMAIL_FROM,
            to: recipient,
            subject: emailSubject,
            text: emailBody
        });
        console.log(`Email job ${payload.job_name} sent to ${recipient}`);
    } catch (error) {
        console.error(`Failed to send email: ${error}`);
    }
}
export default sendEmail;
