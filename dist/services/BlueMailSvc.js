"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectRequestEmail = exports.completeRequestEmail = exports.submitRequestEmail = exports.sendNotificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const ResponseWarp_1 = __importDefault(require("@shared/ResponseWarp"));
const dayjs_1 = __importDefault(require("dayjs"));
const constants_1 = require("@shared/constants");
// Create Transporter
const transporter = nodemailer_1.default.createTransport({
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
const sendNotificationEmail = (emailParams) => __awaiter(void 0, void 0, void 0, function* () {
    const { sender, to, cc, subject, body } = emailParams;
    const email = {
        from: sender,
        html: body,
        to: to,
        subject: subject,
    };
    if (cc) {
        email.cc = cc;
    }
    try {
        const sendEmailRes = yield sentEamil(email);
        return sendEmailRes;
    }
    catch (error) {
        return ResponseWarp_1.default.err(100, error);
    }
});
exports.sendNotificationEmail = sendNotificationEmail;
/**发送邮件 */
const sentEamil = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield transporter.sendMail(email);
        return ResponseWarp_1.default.success();
    }
    catch (error) {
        console.error(error.message);
        console.log('发送邮件失败');
        return ResponseWarp_1.default.err(100, "Error send email ", "errorData", email);
    }
});
const getDocumentTitle = (docCategory) => {
    return `Wofkflow Document - ${docCategory}`;
};
const basicEmailInfo = (formDoc) => `
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
            ${getDocumentTitle(formDoc.docCategory)}
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
                <td style="text-align: left;padding: 8px;width: 25%;">${constants_1.formStatusObj['Pending Approval']}</td>
            </tr>
            <tr>
                <td style="text-align: right;padding: 8px;">Buyer Name:</td>
                <td style="text-align: left;padding: 8px;">${formDoc.requesterName}</td>
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
`;
const submitRequestEmail = (formDoc) => __awaiter(void 0, void 0, void 0, function* () {
    const { approverEmail, approverName, requesterName, requester } = formDoc;
    if (!approverEmail || !requester) {
        return ResponseWarp_1.default.err(500, "Workflow requester or FLL approver is invalid");
    }
    let to = approverEmail;
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
            <p>Submit Date: ${(0, dayjs_1.default)().format('YYYY-MM-DD HH:mm:ss')}</p>
            <br/>
            `,
        subject: `Hawk Visual ${formDoc.docFormId} Submitted for approval`
    };
    const sendEmailRes = yield sentEamil(email);
    if (sendEmailRes.code !== 200) {
        // 发关邮件失败
        console.log('发关邮件失败');
        return ResponseWarp_1.default.err(100, sendEmailRes.data);
    }
    return ResponseWarp_1.default.success();
});
exports.submitRequestEmail = submitRequestEmail;
const completeRequestEmail = (formDoc) => __awaiter(void 0, void 0, void 0, function* () {
    const { approverEmail, approverName, requesterName, requester } = formDoc;
    if (!approverEmail || !requester) {
        return ResponseWarp_1.default.err(500, "Workflow requester or FLL approver is invalid");
    }
    let to = requester;
    const email = {
        from: approverEmail,
        to,
        cc: approverEmail,
        html: `
            <p>Dear ${requesterName || requester},</p>
            <br/>
            <p>This is an automatic reminder sent by Hawk Visual -  Work Flow.</p>
            <p>Below the Request been Completed:</p>
            <br/>
            ${basicEmailInfo(formDoc)}
            <br/>
            <br/>
            <p>Submit Date: ${(0, dayjs_1.default)().format('YYYY-MM-DD HH:mm:ss')}</p>
            <br/>
            `,
        subject: `Hawk Visual ${formDoc.docFormId} Completed`
    };
    const sendEmailRes = yield sentEamil(email);
    if (sendEmailRes.code !== 200) {
        // 发关邮件失败
        console.log('发关邮件失败');
        return ResponseWarp_1.default.err(100, sendEmailRes.data);
    }
    return ResponseWarp_1.default.success();
});
exports.completeRequestEmail = completeRequestEmail;
const rejectRequestEmail = (formDoc) => __awaiter(void 0, void 0, void 0, function* () {
    const { approverEmail, approverName, requesterName, requester } = formDoc;
    if (!approverEmail || !requester) {
        return ResponseWarp_1.default.err(500, "Workflow requester or FLL approver is invalid");
    }
    let to = requester;
    const email = {
        from: approverEmail,
        to,
        cc: approverEmail,
        html: `
            <p>Dear ${requesterName || requester},</p>
            <br/>
            <p>This is an automatic reminder sent by Hawk Visual -  Work Flow.</p>
            <p>Below the Request been Returned:</p>
            <br/>
            ${basicEmailInfo(formDoc)}
            <br/>
            <br/>
            <p>Submit Date: ${(0, dayjs_1.default)().format('YYYY-MM-DD HH:mm:ss')}</p>
            <br/>
            `,
        subject: `Hawk Visual ${formDoc.docFormId} Returned`
    };
    const sendEmailRes = yield sentEamil(email);
    if (sendEmailRes.code !== 200) {
        // 发关邮件失败
        console.log('发关邮件失败');
        return ResponseWarp_1.default.err(100, sendEmailRes.data);
    }
    return ResponseWarp_1.default.success();
});
exports.rejectRequestEmail = rejectRequestEmail;
