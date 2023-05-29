import ResponseWarp from "@shared/ResponseWarp";
import {submitRequestEmail,completeRequestEmail} from './BlueMailSvc';
import type { IFormDocument } from "./main";
import {saveOrUpdateDoc} from './SharedSvc';
import { formStatusObj } from "@shared/constants";
import dayjs from "dayjs";

export const submitDoc = async (doc: IFormDocument) => {
    try {
        let response = await saveOrUpdateDoc(doc);
        if (response.code !== 200) {
            return response;
        }
        const newDoc: IFormDocument = response.data.doc;
        const emailRes = await submitRequestEmail(newDoc);
        if (emailRes.code !== 200) {
            return emailRes;
        }
        newDoc.formStatus = formStatusObj["Pending Approval"];
        newDoc.auditTrail.push({
            who: newDoc.requester || '',
            date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            comments: 'Submitted the document'
        });
        return await saveOrUpdateDoc(newDoc);
    } catch (error: any) {
        console.log(error);
        return ResponseWarp.err(100, error.reason || '', 'errorData', error);
    }
};

export const completeDoc = async (doc: IFormDocument) => {
    try {
        let response = await saveOrUpdateDoc(doc);
        if (response.code !== 200) {
            return response;
        }
        const newDoc: IFormDocument = response.data.doc;
        const emailRes = await completeRequestEmail(newDoc);
        if (emailRes.code !== 200) {
            return emailRes;
        }
        newDoc.formStatus = formStatusObj.Completed;
        newDoc.auditTrail.push({
            who: newDoc.fllEmail,
            date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            comments: 'Approved the document'
        })
        return await saveOrUpdateDoc(newDoc);
    } catch (error: any) {
        console.log(error);
        return ResponseWarp.err(100, error.reason || '', 'errorData', error);
    }
};