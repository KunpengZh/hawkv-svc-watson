import nodemailer from 'nodemailer';
import ResponseWarp from '@shared/ResponseWarp';
import type { IFormDocument } from './main';
import dayjs from 'dayjs';
import { formStatusObj } from '@shared/constants';

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

const basicEmailInfo = (formDoc: IFormDocument) => `
    <div style="
    max-width:1000px; 
    min-width: 850;
    width: 100%;
    overflow: scroll;
    border:1px solid rgb(0,0,0,0.35);
    border-radius: 0.25rem;
    padding: 32px;">
    <div style="width:100%;
        display: flex;
        justify-content: center;
        align-items: center;">
        <p style="
            text-align: center;
            font-size: 32px;
            font-weight: 700;
            color: rgb(0,0,0,0.65);
            border-bottom: 1px solid rgb(0,0,0,0.35);">
            Hawk Visual Work Flow
        </p>
    </div>
    <div style="
            max-width: 850px; 
            min-width: 750px;
            width: 100%;
            overflow: scroll;
            display: flex;
            justify-content: center;
            align-items: center;">
        <table style="width: 100%;">
            <tr>
                <td style="text-align: right;padding: 8px; width: 25%;">HawkVisual ID:</td>
                <td style="text-align: left;padding: 8px;width: 25%;">${formDoc.docFormId}</td>
                <td style="text-align: right;padding: 8px;width: 25%;">HawkVisual Status:</td>
                <td style="text-align: left;padding: 8px;width: 25%;">${formStatusObj['Pending Approval']}</td>
            </tr>
            <tr>
                <td style="text-align: right;padding: 8px;">Buyer Name:</td>
                <td style="text-align: left;padding: 8px;">${formDoc.buyerName}</td>
                <td style="text-align: right;padding: 8px;">Buyer's DPA:</td>
                <td style="text-align: left;padding: 8px;">${formDoc.buyerDPA}</td>
            </tr>
        </table>
    </div>
    <div style="text-align: center; margin: 32px;">
        <a href="${formDoc.hostUrlLink}workflow/formDocDtl/?uuid=${formDoc._id}" rel="noopener noreferrer"
            target="_blank"
            style="text-decoration: none; background-color: rgb(59 130 246);padding:16px;color: white; border-radius: 0.375rem;border-style: none;line-height: 1.5rem;font-size: 1.25rem;">
            Open Workflow Request
        </a>
    </div>
    <br/><br/>
    <p style="font-size: 1.5rem;">If the button link above not working, please copy below to your browser:</p>
    <p style="font-size: 2.5rem;">
        <a href="${formDoc.hostUrlLink}workflow/formDocDtl/?uuid=${formDoc._id}" rel="noopener noreferrer" target="_blank">
            ${formDoc.hostUrlLink}workflow/formDocDtl/?uuid=${formDoc._id}
        </a>
    </p>
    <br/><br/>
    </div>
`


export const submitRequestEmail = async (formDoc: IFormDocument) => {
    const { fllEmail, fllName, requesterName, requester } = formDoc;
    if (!fllEmail || !requester) {
        return ResponseWarp.err(500, "Workflow requester or FLL approver is invalid");
    }
    let to: string | string[] = fllEmail;
    const email = {
        from: requester,
        to,
        cc: requester,
        html: `
            <p>Dear Manager,</p>
            <br/>
            <p>This is an automatic reminder sent by Hawk Visual -  Work Flow.</p>
            <p>Below the Request been submitted to your for approval:</p>
            <br/>
            ${basicEmailInfo(formDoc)}
            <br/>
            <br/>
            <p>Submit Date: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}</p>
            <br/>
            `,
        subject: `Hawk Visual ${formDoc.docFormId} Submitted for approval`
    }
    const sendEmailRes = await sentEamil(email);
    if (sendEmailRes.code !== 200) {
        // 发关邮件失败
        console.log('发关邮件失败')
        return ResponseWarp.err(100, sendEmailRes.data);
    }
    return ResponseWarp.success()
}

export const completeRequestEmail = async (formDoc: IFormDocument) => {
    const { fllEmail, fllName, requesterName, requester } = formDoc;
    if (!fllEmail || !requester) {
        return ResponseWarp.err(500, "Workflow requester or FLL approver is invalid");
    }
    let to: string | string[] = fllEmail;
    const email = {
        from: requester,
        to,
        cc: requester,
        html: `
            <p>Dear ${requesterName || requester},</p>
            <br/>
            <p>This is an automatic reminder sent by Hawk Visual -  Work Flow.</p>
            <p>Below the Request been Completed:</p>
            <br/>
            ${basicEmailInfo(formDoc)}
            <br/>
            <br/>
            <p>Submit Date: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}</p>
            <br/>
            `,
        subject: `Hawk Visual ${formDoc.docFormId} Completed`
    }
    const sendEmailRes = await sentEamil(email);
    if (sendEmailRes.code !== 200) {
        // 发关邮件失败
        console.log('发关邮件失败')
        return ResponseWarp.err(100, sendEmailRes.data);
    }
    return ResponseWarp.success()
}