import ResponseWarp, { ResponseWarpType } from '@shared/ResponseWarp'
import { cloudantDDoc } from '@shared/constants';
import { searchDocByIndex, updateDocument, createNewDocument, getDocumentById, bulkCreateDocuments } from '../cloudant';
import { appSequenceDocId } from '@shared/constants';
import type { AppSequence, QueryParams } from './main';

/**
 * Generates and maintains a sequence of application numbers based on a given date string.
 * The sequence is stored in a database document and only the latest 5 days of records are kept.
 * @param dateStr - The date string in 'YYYY-MM-DD' format.
 * @returns A promise that resolves to an object with 'success', 'error' and 'data' properties.
 */
export async function generateAppSequence(dateStr: string): Promise<ResponseWarpType> {
    // Check if the date string is provided
    if (!dateStr) {
        return ResponseWarp.err(100, 'dateStr is mandatory required')
    }

    try {
        // Generate the app sequence prefix based on the date string
        const appSequencePrefix = `${dateStr}-`;

        // Get the document that stores the app sequence
        const sequenceDoc = await getDocumentById(appSequenceDocId);

        // Find the record for the current day, or create a new one if not found
        let daySequence: AppSequence = sequenceDoc.sequence.find((seq: AppSequence) => seq.key === dateStr);
        if (!daySequence) {
            daySequence = { key: dateStr, sequence: [] };
            sequenceDoc.sequence.push(daySequence);
        }

        // Generate the new app sequence number
        let newSequence;
        if (daySequence.sequence.length === 0) {
            // If there are no previous sequences for the day, start from 1
            newSequence = '00001';
        } else {
            // Otherwise, increment the last sequence number by 1
            const lastSequence = daySequence.sequence[daySequence.sequence.length - 1];
            const lastNumber = Number(lastSequence.substring(lastSequence.length - 5));
            newSequence = String(lastNumber + 1).padStart(5, '0');
        }
        const appSequence = appSequencePrefix + newSequence;

        // Add the new sequence to the day's record
        daySequence.sequence.push(appSequence);

        // Keep only the latest 5 days of records
        const latestSequences = sequenceDoc.sequence.slice(-5);

        // Update the sequence document in the database
        await updateDocument(sequenceDoc);

        return ResponseWarp.success('appSequence', appSequence);
    } catch (error) {
        console.log(error);
        return ResponseWarp.err(100, error.reason || '', 'errorData', error);
    }
}
export const saveOrUpdateDoc = async (doc: Record<string, any>) => {
    try {
        const response = doc._rev ? await updateDocument(doc) : await createNewDocument(doc);

        return ResponseWarp.success('doc', {
            ...doc,
            _rev: response.rev,
            _id: response.id
        });
    } catch (error: any) {
        console.error(error);
        return ResponseWarp.err(100, error.reason || '', 'errorData', error);
    }
};

export const queryByDocId = async (docId: string) => {
    try {
        const response = await getDocumentById(docId);
        return ResponseWarp.success('doc', response);
    } catch (error: any) {
        return ResponseWarp.err(100, error.reason || '', 'errorData', error);
    }
}

export const searchAllDocuments = async (queryObj: Record<string, string>, index: string): Promise<ResponseWarpType> => {
    const query = Object.entries(queryObj)
        .filter(([key, value]) => Array.isArray(value) ? value.length === 2 : Boolean(value))
        .map(([key, value]) => Array.isArray(value) ? `${key}:${value}` : `${key}:"${value}"`)
        .join(" AND ");

    if (!query) {
        return ResponseWarp.err(100, "Please specify Query Params first");
    }

    const docs: any[] = [];

    try {
        let bookmark: string | undefined;
        do {
            const result = await searchDocByIndex({
                ddoc: cloudantDDoc,
                index,
                bookmark,
                query,
                includeDocs: true,
                limit: 200,
            });
            result.rows?.forEach((row) => {
                if (row.doc) {
                    docs.push(row.doc);
                }
            });

            bookmark = result.total_rows > 200 && result.bookmark && result.bookmark !== bookmark ? result.bookmark : undefined;
        } while (bookmark);
    } catch (error: any) {
        console.error(error);
        return ResponseWarp.err(100, error.reason || "", "errorData", error);
    }

    return ResponseWarp.successX({ docs });
};

export async function searchDocumentsPage(queryParams: QueryParams, index: string): Promise<ResponseWarpType> {
    const { limit = 200, bookmark, current = 0, direction = 'next', ...queryObj } = queryParams;
    try {
        const queryStr = Object.entries(queryObj)
            .filter(([key, value]) => Array.isArray(value) ? value.length === 2 : Boolean(value))
            .map(([key, value]) => Array.isArray(value) ? `${key}:${value}` : `${key}:"${value}"`)
            .join(" AND ") ?? "";

        const result = await searchDocByIndex({
            ddoc: 'searchIndex',
            index,
            query: queryStr,
            bookmark: bookmark?.toString(),
            limit: Number(limit),
            includeDocs: true,
        });

        return ResponseWarp.successX({
            total: result.total_rows,
            bookmark: result.bookmark,
            records: result.rows?.map(row => row.doc),
            previousBookmark: bookmark?.toString(),
            limit: Number(limit),
            current: direction === 'next' ? current + 1 : current - 1,
            direction,
        });
    } catch (error: any) {
        console.error(error);
        return ResponseWarp.err(100, error.reason || "", "errorData", error);
    }
};

export async function bulkCreateDocs(docs: any[]) {
    try {
        return await bulkCreateDocuments({ docs });
    } catch (error: any) {
        return ResponseWarp.err(100, JSON.stringify(error));
    }
};

