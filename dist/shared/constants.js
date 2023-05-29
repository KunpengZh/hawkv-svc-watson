"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formStatusObj = exports.docTypes = exports.HAWK_PREFIX = exports.PageQueryExcludeParms = exports.USER_GROUP_DOC_ID = exports.appSequenceDocId = exports.userGroup = exports.userProfile = exports.byIndex = exports.cloudantDDoc = exports.WITHOUR_SECRET = exports.HAWK_TOKEN = exports.COOKIE_EXP = exports.JWT_SECRET = void 0;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.COOKIE_EXP = process.env.COOKIE_EXP || 86400000;
exports.HAWK_TOKEN = 'hawk-token';
exports.WITHOUR_SECRET = "036e21e2641b35b5f0a7d098bab4ce770b43041fc7c7919a18112e8ae5092c19";
exports.cloudantDDoc = 'searchIndex';
exports.byIndex = "byIndex";
exports.userProfile = "byUserProfile";
exports.userGroup = "byUserGroup";
exports.appSequenceDocId = "hawk-visual-sequence-doc";
exports.USER_GROUP_DOC_ID = "hawk-visual-usergroup-doc";
exports.PageQueryExcludeParms = ['limit', 'bookmark', 'current', 'direction'];
exports.HAWK_PREFIX = "HAWKV-";
exports.docTypes = {
    'userProfile': 'userProfile',
    'userGroup': 'userGroup',
    'FormDocument': 'FormDocument'
};
exports.formStatusObj = {
    'Draft': 'Draft',
    'Pending Approval': 'Pending Approval',
    'Completed': 'Completed'
};
