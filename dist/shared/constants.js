"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageQueryExcludeParms = exports.appSequencePrefix = exports.appSequenceDocId = exports.cloudantSearchIndex = exports.cloudantDDoc = exports.WITHOUR_SECRET = exports.HAWK_TOKEN = exports.COOKIE_EXP = exports.JWT_SECRET = void 0;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.COOKIE_EXP = process.env.COOKIE_EXP || 86400000;
exports.HAWK_TOKEN = 'hawk-token';
exports.WITHOUR_SECRET = "036e21e2641b35b5f0a7d098bab4ce770b43041fc7c7919a18112e8ae5092c19";
exports.cloudantDDoc = 'searchIndex';
exports.cloudantSearchIndex = "byIndex";
exports.appSequenceDocId = "hawk-visual-sequence-doc";
exports.appSequencePrefix = 'PTT-';
exports.PageQueryExcludeParms = ['limit', 'bookmark', 'current', 'direction'];
