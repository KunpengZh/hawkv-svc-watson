import ResponseWarp from '@shared/ResponseWarp'
import {  updateDocument, createNewDocument } from '../cloudant';
import type { PTTDoc, SubmitParams } from './main';
import type { CloudantV1 } from '@ibm-cloud/cloudant';
import { sendPTTEmails } from './BlueMailSvc';

export const submitPTTRequest = async (params: SubmitParams) => {
    const { doc } = params;
    try {
        let response: CloudantV1.DocumentResult;
        if ((doc._id && !doc._rev) || (doc._rev && !doc._id)) {
            return ResponseWarp.err(100, 'Document _id, _rev inclrrect');
        }
        if (doc._id && doc._rev) {
            response = await updateDocument(doc);
        } else {
            response = await createNewDocument(doc);
        }
        const pttDoc: PTTDoc = {
            ...doc,
            _rev: response.rev,
            _id: response.id
        }
        const emailRes = await sendPTTEmails({
            ...params,
            hostUrlLink:`${params.hostUrlLink}${pttDoc._id}`,
            doc: pttDoc,
            emailKey: 'onSubmit'
        });
        if (emailRes.code !== 200) {
            return ResponseWarp.err(202, "Document saved but send email failed", 'doc', pttDoc);
        }
        return ResponseWarp.success('doc', pttDoc);
    } catch (error: any) {
        console.log(error);
        return ResponseWarp.err(100, error.reason || '', 'errorData', error);
    }
};

