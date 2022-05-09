import ResponseWarp from '@shared/ResponseWarp'
import {  updateDocument, createNewDocument } from '../cloudant';
import type { RBADoc, SubmitParams } from './main';
import type { CloudantV1 } from '@ibm-cloud/cloudant';
import { sendRBAEmails } from './BlueMailSvc';

export const submitRBARequest = async (params: SubmitParams) => {
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
        const rbaDoc: RBADoc = {
            ...doc,
            _rev: response.rev,
            _id: response.id
        }
        const emailRes = await sendRBAEmails({
            ...params,
            hostUrlLink:`${params.hostUrlLink}${rbaDoc._id}`,
            doc: rbaDoc,
            emailKey: 'onSubmit'
        });
        if (emailRes.code !== 200) {
            return ResponseWarp.err(202, "Document saved but send email failed", 'doc', rbaDoc);
        }
        return ResponseWarp.success('doc', rbaDoc);
    } catch (error: any) {
        console.log(error);
        return ResponseWarp.err(100, error.reason || '', 'errorData', error);
    }
};

