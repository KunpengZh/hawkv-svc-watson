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
exports.sendPTTEmails = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const ResponseWarp_1 = __importDefault(require("@shared/ResponseWarp"));
const EmailTemplate_1 = require("./EmailTemplate");
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
const sendPTTEmails = (emailParams) => __awaiter(void 0, void 0, void 0, function* () {
    const { sender, receiver, cc, emailKey, doc, hostUrlLink } = emailParams;
    const emailTemplate = EmailTemplate_1.emailTemplates[emailKey];
    if (!emailTemplate) {
        return ResponseWarp_1.default.err(100, 'emailTemplateName: ' + emailKey + ' does not exist');
    }
    const email = {
        from: sender,
        html: emailTemplate.emailBody(doc, hostUrlLink),
        to: receiver,
        subject: emailTemplate.subject(doc),
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
exports.sendPTTEmails = sendPTTEmails;
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
