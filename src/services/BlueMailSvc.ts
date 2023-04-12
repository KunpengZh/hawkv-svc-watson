import nodemailer from 'nodemailer';
import ResponseWarp from '@shared/ResponseWarp';

// Create Transporter
const transporter = nodemailer.createTransport({
    host: "na.relay.ibm.com",
    port: 25,
    secure: false,
    ignoreTLS: true,
    debug: false,
    tls: {
        rejectUnauthorized: false,
    },
});
/**
 * 发送邮件
 * @param cerEmailParam 
 * @returns 
 */
export const sendNotificationEmail = async (emailParams: {
    sender: string;
    to: string | string[];
    cc?: string | string[];
    subject?: string;
    body?: string;
}) => {
    const { sender, to, cc, subject, body } = emailParams;

    const email: any = {
        from: sender,
        html: body,
        to: to,
        subject: subject,
    }
    if (cc) {
        email.cc = cc;
    }
    try {
        const sendEmailRes = await sentEamil(email);
        return sendEmailRes;
    } catch (error: any) {
        return ResponseWarp.err(100, error);
    }
}


/**发送邮件 */
const sentEamil = async (email: any) => {
    try {
        const result = await transporter.sendMail(email);
        return ResponseWarp.success()
    } catch (error: any) {
        console.error(error.message);
        console.log('发送邮件失败')
        return ResponseWarp.err(100, "Error send email ", "errorData", email,)
    }
}