import nodemailer from 'nodemailer';
import ResponseWarp from '@shared/ResponseWarp';
import  type {PTTEmailParams} from './main';
import { emailTemplates } from './EmailTemplate';

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
export const sendPTTEmails = async (emailParams: PTTEmailParams) => {
    const {sender,receiver,cc,emailKey,doc,hostUrlLink } = emailParams;
    const emailTemplate = emailTemplates[emailKey];
    if (!emailTemplate) {
        return ResponseWarp.err(100, 'emailTemplateName: ' + emailKey + ' does not exist');
    }
    const email: any = {
        from: sender,
        html: emailTemplate.emailBody(doc,hostUrlLink),
        to: receiver,
        subject: emailTemplate.subject(doc),
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