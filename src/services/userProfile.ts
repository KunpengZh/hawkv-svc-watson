import { searchDocByIndex, createNewDocument, updateDocument, bulkCreateDocuments } from '../cloudant';
import ResponseWarp from '../shared/ResponseWarp';
import { CloudantV1 } from "@ibm-cloud/cloudant";
import{cloudantDDoc} from '../shared/constants';

export interface UserProfile {
    _id?: string;
    _rev?: string;
    docType?: string;
    userRole?: string;
    bio?: string;
    orgTitle?: string;
    uid?: string;
    emailAddress?: string;
    firstName?: string;
    lastName?: string;
    preferred_username?: string;
    userName?: string;
    avatar?: string;
    isActive?: number;
}
export interface queryUserProfileList{
    limit?: number;
    bookmark?: string;
    current?: number;
    direction?: 'next' | 'last',
    userRole?: string;
    emailAddress?: string;
}

/**一次拉取所有的用户Profile */
export async function loadAllUserProfiles() {
    const query = 'docType:"userProfile"';
    let nBookmark: string | undefined = undefined;
    const userProfiles: UserProfile[] = [];
    do {
        const result: CloudantV1.SearchResult = await searchDocByIndex({
            ddoc: cloudantDDoc,
            index: 'userProfile',
            query: query,
            bookmark: nBookmark ? nBookmark : undefined,
            limit: 200,
            includeDocs: true,
        });
        const { bookmark, rows } = result;
        rows?.forEach(row => {
            const { doc } = row;
            if (doc) {
                userProfiles.push({
                    userRole: doc.userRole,
                    uid: doc.uid,
                    emailAddress: doc.emailAddress,
                    preferred_username: doc.preferred_username,
                    userName: doc.userName,
                    isActive: doc.isActive,
                })
            }
        });
        nBookmark = bookmark && bookmark !== nBookmark ? bookmark : undefined;
    } while (nBookmark);
    return ResponseWarp.successX({ userProfiles });
}

export async function loadUserProfileList(payload: queryUserProfileList) {
    try {
        const { limit, bookmark, current = 0, direction = 'next', userRole, emailAddress } = payload;
        let query = 'docType:"userProfile"';
        if (userRole) {
            query = `${query} AND userRole:"${userRole}"`;
        }
        if (emailAddress) {
            query = `${query} && emailAddress:"${emailAddress}"`;
        }

        const result = await searchDocByIndex({
            ddoc: 'searchIndex',
            index: 'userProfile',
            query: query,
            bookmark: bookmark ? bookmark.toString() : undefined,
            limit: limit ? Number(limit) : 20,
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

export async function createUserProfile(userProfile: UserProfile) {
    try {
        if (!userProfile || userProfile._id) {
            return ResponseWarp.err(100, 'userProfile format incorrect');
        }
        const creationRes = await createNewDocument(userProfile);
        return ResponseWarp.successX({
            ...userProfile,
            _id: creationRes.id,
            _rev: creationRes.rev
        });
    } catch (error: any) {
        return ResponseWarp.err(100, JSON.stringify(error));
    }

};

export async function updateUserProfile(userProfile: UserProfile) {
    try {
        if (!userProfile || !userProfile._id) {
            return ResponseWarp.err(100, 'userProfile format incorrect');
        }
        const updateRes = await updateDocument(userProfile)
        return ResponseWarp.successX({
            ...userProfile,
            _rev: updateRes.rev
        });
    } catch (error: any) {
        return ResponseWarp.err(100, JSON.stringify(error));
    }

};

export async function bulkCreateUserProfiles(userProfiles: UserProfile[]) {
    try {
        return await bulkCreateDocuments({ docs: userProfiles });
    } catch (error: any) {
        return ResponseWarp.err(100, JSON.stringify(error));
    }
};