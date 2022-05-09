import ResponseWarp from '@shared/ResponseWarp'
import { cloudantDDoc, cloudantSearchIndex } from '@shared/constants';
import { searchDocByIndex, updateDocument, createNewDocument, getDocumentById } from '../cloudant';
import { appSequenceDocId, appSequencePrefix, PageQueryExcludeParms } from '@shared/constants';
import type { AppSequence,QueryParams } from './main';

export const generalAppSequence = async (dateStr: string) => {
    if (!dateStr) {
        return ResponseWarp.err(100, 'dateStr is mandatory required')
    }
    try {
        let appSequence = `${appSequencePrefix}${dateStr}-`;
        const sequenceDoc = await getDocumentById(appSequenceDocId);
        const daySequence: AppSequence = sequenceDoc.sequence.filter((obj: AppSequence) => obj.key === dateStr)[0] || {
            key: dateStr,
            sequence: []
        };
        const { sequence } = daySequence;
        if (sequence.length > 0) {
            const lastSequence = sequence[sequence.length - 1];
            const lastNumber = Number(lastSequence.substring(lastSequence.length - 5)) + 1;
            const newSequence = (Array(5).join('0') + lastNumber).slice(-5);
            appSequence = appSequence + newSequence;
            sequence.push(appSequence);
        } else {
            appSequence = appSequence + '00001';
            sequence.push(appSequence);
        }
        daySequence.sequence = sequence;
        /** 只保留 最近的5天记录 */
        let isDateStrExist = false;
        let daySequenceArray = sequenceDoc.sequence.slice(sequenceDoc.sequence.length - 5 < 0 ? 0 : sequenceDoc.sequence.length - 5, sequenceDoc.sequence.length).map((seq: AppSequence) => {
            if (seq.key === dateStr) {
                isDateStrExist = true;
                return daySequence
            }
            return seq;
        });
        if (!isDateStrExist) {
            daySequenceArray.push(daySequence);
        }

        sequenceDoc.sequence = daySequenceArray;
        await updateDocument(sequenceDoc);
        return ResponseWarp.success('appSequence', appSequence);
    } catch (error: any) {
        console.log(error);
        return ResponseWarp.err(100, error.reason || '', 'errorData', error);
    }
}

export const saveDoc = async (doc: Record<string, any>) => {
    try {
        if ((doc._id && !doc._rev) || (doc._rev && !doc._id)) {
            return ResponseWarp.err(100, 'Document _id, _rev inclrrect');
        }
        if (doc._id && doc._rev) {
            const response = await updateDocument(doc);
            return ResponseWarp.success('doc', {
                ...doc,
                _rev: response.rev,
                _id: response.id
            });
        } else {
            const response = await createNewDocument(doc);
            return ResponseWarp.success('doc', {
                ...doc,
                _rev: response.rev,
                _id: response.id
            });
        }
    } catch (error: any) {
        console.log(error);
        return ResponseWarp.err(100, error.reason || '', 'errorData', error);
    }

};
export const queryByDocId = async (docId: string) => {
    try {
        const response = await getDocumentById(docId);
        return ResponseWarp.success('doc', [response]);
    } catch (error: any) {
        console.log(error);
        return ResponseWarp.err(100, error.reason || '', 'errorData', error);
    }
}

export const searchDocuments = async (queryObj: Record<string, string>) => {
    let queryStr: string | undefined = undefined;
    for (let key of Object.keys(queryObj)) {
        if (queryObj[key]) {
            if (!queryStr) {
                queryStr = `${key}:"${queryObj[key]}"`;
            } else {
                queryStr = queryStr + ` AND ${key}:"${queryObj[key]}"`;
            }
        }
    }
    if (!queryStr) {
        return ResponseWarp.err(100, 'Please specify Query Params first');
    }
    try {
        const response = await searchDocByIndex({
            ddoc: cloudantDDoc,
            index: cloudantSearchIndex,
            query: queryStr,
            includeDocs: true,
        });
        return ResponseWarp.success('docs', response.rows?.map(row => row.doc) || []);
    } catch (error: any) {
        console.log(error);
        return ResponseWarp.err(100, error.reason || '', 'errorData', error);
    }
}

export async function searchDocumentsPage(queryObj: QueryParams) {
    try {
        const { limit = 20, bookmark, current = 0, direction = 'next' } = queryObj;
        let queryStr: string | undefined = undefined;
        const queryKeys = Object.keys(queryObj).filter(key => !PageQueryExcludeParms.includes(key));
        for (let key of queryKeys) {
            if (queryObj[key]) {
                if (!queryStr) {
                    queryStr = `${key}:"${queryObj[key]}"`;
                } else {
                    queryStr = queryStr + ` AND ${key}:"${queryObj[key]}"`;
                }
            }
        }
        console.log(queryStr);
        const result = await searchDocByIndex({
            ddoc: 'searchIndex',
            index: 'byIndex',
            query: queryStr || '',
            bookmark: bookmark ? bookmark.toString() : undefined,
            limit: Number(limit),
            includeDocs: true,
        });
        return ResponseWarp.successX({
            total: result.total_rows,
            bookmark: result.bookmark,
            records: result.rows?.map((row: any) => row.doc),
            previousBookmark: bookmark ? bookmark.toString() : undefined,
            limit: limit ? Number(limit) : 20,
            current: direction === 'next' ? current + 1 : current - 1,
            direction,
        });
    } catch (error: any) {
        return ResponseWarp.err(100, JSON.stringify(error));
    }
};

