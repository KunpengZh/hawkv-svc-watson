export const JWT_SECRET=process.env.JWT_SECRET;
export const COOKIE_EXP=process.env.COOKIE_EXP || 86400000;
export const HAWK_TOKEN='hawk-token';
export const WITHOUR_SECRET="036e21e2641b35b5f0a7d098bab4ce770b43041fc7c7919a18112e8ae5092c19";

export const cloudantDDoc = 'searchIndex';
export const byIndex = "byIndex";
export const userProfile = "byUserProfile";
export const userGroup = "byUserGroup";

export const appSequenceDocId="hawk-visual-sequence-doc";
export const USER_GROUP_DOC_ID="hawk-visual-usergroup-doc";
export const PageQueryExcludeParms=['limit', 'bookmark', 'current', 'direction'];
export const HAWK_PREFIX="HAWKV-";

export const docTypes={
    'userProfile':'userProfile',
    'userGroup':'userGroup',
    'FormDocument':'FormDocument'
}

export const formStatusObj = {
    'Draft': 'Draft',
    'Pending Approval':'Pending Approval',
    'Completed': 'Completed'
}

