export interface AppSequence {
    key: string;
    sequence: string[];
}
export interface QueryParams {
    limit?: number;
    bookmark?: string;
    current?: number;
    direction?: 'next' | 'last';
    [key: string]: any;
    bookmarks?:string[];
}

export interface IUserGroupDoc {
    _id?: string;
    _rev?: string;
    docType: 'userGroup';
    userGroups: IUserGroup[]
}
export interface IUserGroup {
    key: number | string;
    userGroup: string;
    userList: string;
}

export interface IFormDocument {
    _id?: string;
    _rev?: string;

    docFormId: string;
    docType: 'FormDocument',
    docCategory: string;
    requester: string;
    requesterName: string;

    fllEmail: string;
    fllName: string;

    formStatus: string;
    readers?: string;
    editors?: string;
    createDate: string;
    lastModified?: string;

    indexDoc: string;
    parentId?: string;
    parentDocFormId?: string;
    childrenId?: string;
    childrenDocFormId?: string

    SSRMAttach?: IAttachment[];
    SOWAttach?: IAttachment[];
    legalReviewAttach?: IAttachment[];

    boxFolderId?: string;
    boxFolderName?: string;

    auditTrail: {
        who: string;
        date: string;
        comments: string;
    }[];

    [key: string]: any;
}

interface IAttachment {
    fileId: string;
    fileName: string;
    fileSequence: number;
    isParentDocument?: boolean;
    docFormId: string;
}