"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkCreateDocs = exports.searchDocumentsPage = exports.searchAllDocuments = exports.queryByDocId = exports.saveOrUpdateDoc = exports.generateAppSequence = void 0;
const ResponseWarp_1 = __importDefault(require("@shared/ResponseWarp"));
const constants_1 = require("@shared/constants");
const cloudant_1 = require("../cloudant");
const constants_2 = require("@shared/constants");
/**
 * Generates and maintains a sequence of application numbers based on a given date string.
 * The sequence is stored in a database document and only the latest 5 days of records are kept.
 * @param dateStr - The date string in 'YYYY-MM-DD' format.
 * @returns A promise that resolves to an object with 'success', 'error' and 'data' properties.
 */
function generateAppSequence(dateStr) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if the date string is provided
        if (!dateStr) {
            return ResponseWarp_1.default.err(100, 'dateStr is mandatory required');
        }
        try {
            // Generate the app sequence prefix based on the date string
            const appSequencePrefix = `${constants_1.HAWK_PREFIX}${dateStr}-`;
            // Get the document that stores the app sequence
            const sequenceDoc = yield (0, cloudant_1.getDocumentById)(constants_2.appSequenceDocId);
            // Find the record for the current day, or create a new one if not found
            let daySequence = sequenceDoc.sequence.find((seq) => seq.key === dateStr);
            if (!daySequence) {
                daySequence = { key: dateStr, sequence: [] };
                sequenceDoc.sequence.push(daySequence);
            }
            // Generate the new app sequence number
            let newSequence;
            if (daySequence.sequence.length === 0) {
                // If there are no previous sequences for the day, start from 1
                newSequence = '00001';
            }
            else {
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
            yield (0, cloudant_1.updateDocument)(sequenceDoc);
            return ResponseWarp_1.default.success('appSequence', appSequence);
        }
        catch (error) {
            console.log(error);
            return ResponseWarp_1.default.err(100, error.reason || '', 'errorData', error);
        }
    });
}
exports.generateAppSequence = generateAppSequence;
const saveOrUpdateDoc = (doc) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = doc._rev ? yield (0, cloudant_1.updateDocument)(doc) : yield (0, cloudant_1.createNewDocument)(doc);
        return ResponseWarp_1.default.success('doc', Object.assign(Object.assign({}, doc), { _rev: response.rev, _id: response.id }));
    }
    catch (error) {
        console.error(error);
        return ResponseWarp_1.default.err(100, error.reason || '', 'errorData', error);
    }
});
exports.saveOrUpdateDoc = saveOrUpdateDoc;
const queryByDocId = (docId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, cloudant_1.getDocumentById)(docId);
        return ResponseWarp_1.default.success('doc', response);
    }
    catch (error) {
        return ResponseWarp_1.default.err(100, error.reason || '', 'errorData', error);
    }
});
exports.queryByDocId = queryByDocId;
const searchAllDocuments = (queryObj, index) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const query = Object.entries(queryObj)
        .filter(([key, value]) => Array.isArray(value) ? value.length === 2 : Boolean(value))
        .map(([key, value]) => Array.isArray(value) ? `${key}:${value}` : `${key}:"${value}"`)
        .join(" AND ");
    if (!query) {
        return ResponseWarp_1.default.err(100, "Please specify Query Params first");
    }
    const docs = [];
    try {
        let bookmark;
        do {
            const result = yield (0, cloudant_1.searchDocByIndex)({
                ddoc: constants_1.cloudantDDoc,
                index,
                bookmark,
                query,
                includeDocs: true,
                limit: 200,
            });
            (_a = result.rows) === null || _a === void 0 ? void 0 : _a.forEach((row) => {
                if (row.doc) {
                    docs.push(row.doc);
                }
            });
            bookmark = result.total_rows > 200 && result.bookmark && result.bookmark !== bookmark ? result.bookmark : undefined;
        } while (bookmark);
    }
    catch (error) {
        console.error(error);
        return ResponseWarp_1.default.err(100, error.reason || "", "errorData", error);
    }
    return ResponseWarp_1.default.successX({ docs });
});
exports.searchAllDocuments = searchAllDocuments;
function searchDocumentsPage(queryParams, index) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const { limit = 200, bookmark, current = 0, direction = 'next', bookmarks = [] } = queryParams, queryObj = __rest(queryParams, ["limit", "bookmark", "current", "direction", "bookmarks"]);
        try {
            const queryStr = (_a = Object.entries(queryObj)
                .filter(([key, value]) => Array.isArray(value) ? value.length === 2 : Boolean(value))
                .map(([key, value]) => Array.isArray(value) ? `${key}:${value}` : `${key}:"${value}"`)
                .join(" AND ")) !== null && _a !== void 0 ? _a : "";
            console.info(queryStr);
            const result = yield (0, cloudant_1.searchDocByIndex)({
                ddoc: 'searchIndex',
                index,
                query: queryStr,
                bookmark: bookmark === null || bookmark === void 0 ? void 0 : bookmark.toString(),
                limit: Number(limit),
                includeDocs: true,
            });
            /**
             * 管理历史的 booksmarks
             * 如果是新出现的bookmark,应该是新的一页,我们只需要将其顺序加入到bookmarks数组中
             * 如果是已经存在的bookmark,说明是向前翻页,我们只需要保留从0开始到这个bookmark的数组
             */
            const newBookMark = result.bookmark;
            let newBookmarks = bookmarks;
            if (newBookMark) {
                if (newBookmarks.includes(newBookMark)) {
                    newBookmarks = newBookmarks.slice(0, newBookmarks.indexOf(newBookMark) + 1);
                }
                else {
                    newBookmarks.push(newBookMark);
                }
            }
            else {
                newBookmarks = [];
            }
            return ResponseWarp_1.default.successX({
                total: result.total_rows,
                bookmark: newBookMark,
                records: (_b = result.rows) === null || _b === void 0 ? void 0 : _b.map(row => row.doc),
                bookmarks: newBookmarks,
                limit: Number(limit),
                current: direction === 'next' ? current + 1 : Math.max(current - 1, 1),
                direction,
            });
        }
        catch (error) {
            console.error(error);
            return ResponseWarp_1.default.err(100, error.reason || "", "errorData", error);
        }
    });
}
exports.searchDocumentsPage = searchDocumentsPage;
;
function bulkCreateDocs(docs) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield (0, cloudant_1.bulkCreateDocuments)({ docs });
        }
        catch (error) {
            return ResponseWarp_1.default.err(100, JSON.stringify(error));
        }
    });
}
exports.bulkCreateDocs = bulkCreateDocs;
;
