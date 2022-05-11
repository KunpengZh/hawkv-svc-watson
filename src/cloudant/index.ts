import { CloudantV1 } from "@ibm-cloud/cloudant";

const cerDBName = 'hawkv-db-ptt';

const client = CloudantV1.newInstance({ serviceName: 'CLOUDANT' });

let lastExecutionTimeStamp: number = 0;
const isReady = (now: number) => {
    if ((now - lastExecutionTimeStamp) > 250) {
        lastExecutionTimeStamp = now;
        return true;
    }
    return false;
}

const sleep = async (): Promise<void> => {
    return new Promise<void>(resolve => {
        function wait() {
            let now = Date.parse(new Date().toString());
            if (isReady(now)) {
                resolve();
            } else {
                setTimeout(() => {
                    wait();
                }, 250);
            }
        }
        wait();
    });
}

export default function Cloudant() {
    return client;
}
export async function getDocumentById(id: string) {
    await sleep();
    try {
        const getDocParams: CloudantV1.GetDocumentParams = {
            db: cerDBName || 'hawkv-db-ptt',
            docId: id,
        };
        const res = await client.getDocument(getDocParams);
        if (res.status === 200) {
            return res.result || {}
        }
        throw new Error(JSON.stringify(res));
    } catch (error: any) {
        throw error
    };
}

export async function deleteDocuments(payload: {
    docId: string;
    rev: string;
}) {
    await sleep();
    try {
        const res = await client.deleteDocument({
            db: cerDBName || 'hawkv-db-ptt',
            ...payload
        });
        return res;
    } catch (error: any) {
        throw error
    };
}

export async function searchDocByIndex(payload: {
    ddoc: string;
    index: string;
    query: string;
    bookmark?: string;
    limit?: number;
    includeDocs?: boolean;
    includeFields?: string[];
}) {
    await sleep();
    try {
        const params: CloudantV1.PostSearchParams = {
            ...payload,
            db: cerDBName || 'hawkv-db-ptt',
            includeFields: payload.includeFields || [],
            limit: payload.limit || 20,
        };
        const searchRes = await client.postSearch(params);
        if (searchRes.status === 200) {
            return searchRes.result || {}
        }
        throw new Error(JSON.stringify(searchRes));
    } catch (error: any) {
        throw error
    };
}

export async function createNewDocument(doc: CloudantV1.Document) {
    await sleep();
    try {
        const params: CloudantV1.PostDocumentParams = {
            db: cerDBName || 'hawkv-db-ptt',
            document: doc
        }
        const response = await client.postDocument(params);
        if (response.result?.ok) {
            return response.result
        }
        throw new Error(JSON.stringify(response));
    } catch (error: any) {
        throw error
    };
}

export async function updateDocument(doc: CloudantV1.Document) {
    await sleep();
    try {
        if (!doc._id) {
            throw new Error("The document do not have a _id");
        }
        const params: CloudantV1.PutDocumentParams = {
            db: cerDBName || 'hawkv-db-ptt',
            docId: doc._id,
            document: doc
        }
        const response = await client.putDocument(params);
        if (response.result?.ok) {
            return response.result
        }
        throw new Error(JSON.stringify(response));
    } catch (error: any) {
        throw error
    };
}

export async function bulkCreateDocuments(bulkDocs: {
    docs: CloudantV1.Document[]
}) {
    await sleep();
    try {
        const params: CloudantV1.PostBulkDocsParams = {
            db: cerDBName || 'hawkv-db-ptt',
            bulkDocs,
        }
        const response = await client.postBulkDocs(params);
        if (response.status === 201) {
            return response.result;
        }
        throw new Error(JSON.stringify(response));
    } catch (error: any) {
        throw error
    };
}
export async function bulkUpdateDocuments(bulkDocs: {
    docs: CloudantV1.Document[]
}) {
    await sleep();
    try {
        const params: CloudantV1.PostBulkDocsParams = {
            db: cerDBName || 'hawkv-db-ptt',
            bulkDocs,
        }
        const response = await client.postBulkDocs(params);
        if (response.status === 201) {
            return response.result;
        }
        throw new Error(JSON.stringify(response));
    } catch (error: any) {
        throw error
    };
}

export async function queryDocumentBydIds(docIds: string[]) {
    await sleep();
    try {
        if (docIds.length > 200) {
            throw new Error("The given docIds over the limited 200");
        }
        const response = await client.postFind({
            db: cerDBName || 'hawkv-db-ptt',
            selector: {
                "_id": {
                    "$in": docIds
                }
            }
        });
        if (response.status === 200) {
            return response.result.docs || [];
        }
        throw new Error(JSON.stringify(response));
    } catch (error: any) {
        throw error
    };
}

export async function getAttachment(docId: string, attachmentName: string, dbName: string = 'cpc-cerdoc-prod') {
    await sleep();
    try {
        const response = await client.getAttachment({
            db: dbName,
            docId: docId,
            attachmentName: attachmentName,
        });
        if (response.status === 200) {
            return response.result
        }
        throw new Error(JSON.stringify(response));
    } catch (error: any) {
        console.log(JSON.stringify(error));
        throw error
    };
}
