import nodemailer from "nodemailer";
import { EMAIL_FROM, EMAIL_PASSWORD, EMAIL_USER } from "../constants";

interface EmailPayload {
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
    const { recipient, emailSubject, emailBody } = payload;
    await emailTransporter.sendMail({
        from: EMAIL_FROM,
        to: recipient,
        subject: emailSubject,
        text: emailBody
    });
    console.log(`Email job ${payload}`);
}

export default sendEmail;
