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