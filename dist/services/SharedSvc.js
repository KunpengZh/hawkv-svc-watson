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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchDocumentsPage = exports.searchDocuments = exports.queryByDocId = exports.saveDoc = exports.generalAppSequence = void 0;
const ResponseWarp_1 = __importDefault(require("@shared/ResponseWarp"));
const constants_1 = require("@shared/constants");
const cloudant_1 = require("../cloudant");
const constants_2 = require("@shared/constants");
const generalAppSequence = (dateStr) => __awaiter(void 0, void 0, void 0, function* () {
    if (!dateStr) {
        return ResponseWarp_1.default.err(100, 'dateStr is mandatory required');
    }
    try {
        let appSequence = `${constants_2.appSequencePrefix}${dateStr}-`;
        const sequenceDoc = yield (0, cloudant_1.getDocumentById)(constants_2.appSequenceDocId);
        const daySequence = sequenceDoc.sequence.filter((obj) => obj.key === dateStr)[0] || {
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
        }
        else {
            appSequence = appSequence + '00001';
            sequence.push(appSequence);
        }
        daySequence.sequence = sequence;
        /** 只保留 最近的5天记录 */
        let isDateStrExist = false;
        let daySequenceArray = sequenceDoc.sequence.slice(sequenceDoc.sequence.length - 5 < 0 ? 0 : sequenceDoc.sequence.length - 5, sequenceDoc.sequence.length).map((seq) => {
            if (seq.key === dateStr) {
                isDateStrExist = true;
                return daySequence;
            }
            return seq;
        });
        if (!isDateStrExist) {
            daySequenceArray.push(daySequence);
        }
        sequenceDoc.sequence = daySequenceArray;
        yield (0, cloudant_1.updateDocument)(sequenceDoc);
        return ResponseWarp_1.default.success('appSequence', appSequence);
    }
    catch (error) {
        console.log(error);
        return ResponseWarp_1.default.err(100, error.reason || '', 'errorData', error);
    }
});
exports.generalAppSequence = generalAppSequence;
const saveDoc = (doc) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if ((doc._id && !doc._rev) || (doc._rev && !doc._id)) {
            return ResponseWarp_1.default.err(100, 'Document _id, _rev inclrrect');
        }
        if (doc._id && doc._rev) {
            const response = yield (0, cloudant_1.updateDocument)(doc);
            return ResponseWarp_1.default.success('doc', Object.assign(Object.assign({}, doc), { _rev: response.rev, _id: response.id }));
        }
        else {
            const response = yield (0, cloudant_1.createNewDocument)(doc);
            return ResponseWarp_1.default.success('doc', Object.assign(Object.assign({}, doc), { _rev: response.rev, _id: response.id }));
        }
    }
    catch (error) {
        console.log(error);
        return ResponseWarp_1.default.err(100, error.reason || '', 'errorData', error);
    }
});
exports.saveDoc = saveDoc;
const queryByDocId = (docId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, cloudant_1.getDocumentById)(docId);
        return ResponseWarp_1.default.success('doc', [response]);
    }
    catch (error) {
        console.log(error);
        return ResponseWarp_1.default.err(100, error.reason || '', 'errorData', error);
    }
});
exports.queryByDocId = queryByDocId;
const searchDocuments = (queryObj) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let queryStr = undefined;
    for (let key of Object.keys(queryObj)) {
        if (queryObj[key]) {
            if (!queryStr) {
                queryStr = `${key}:"${queryObj[key]}"`;
            }
            else {
                queryStr = queryStr + ` AND ${key}:"${queryObj[key]}"`;
            }
        }
    }
    if (!queryStr) {
        return ResponseWarp_1.default.err(100, 'Please specify Query Params first');
    }
    try {
        const response = yield (0, cloudant_1.searchDocByIndex)({
            ddoc: constants_1.cloudantDDoc,
            index: constants_1.cloudantSearchIndex,
            query: queryStr,
            includeDocs: true,
        });
        return ResponseWarp_1.default.success('docs', ((_a = response.rows) === null || _a === void 0 ? void 0 : _a.map(row => row.doc)) || []);
    }
    catch (error) {
        console.log(error);
        return ResponseWarp_1.default.err(100, error.reason || '', 'errorData', error);
    }
});
exports.searchDocuments = searchDocuments;
function searchDocumentsPage(queryObj) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { limit = 20, bookmark, current = 0, direction = 'next' } = queryObj;
            let queryStr = undefined;
            const queryKeys = Object.keys(queryObj).filter(key => !constants_2.PageQueryExcludeParms.includes(key));
            for (let key of queryKeys) {
                if (queryObj[key]) {
                    if (!queryStr) {
                        queryStr = `${key}:"${queryObj[key]}"`;
                    }
                    else {
                        queryStr = queryStr + ` AND ${key}:"${queryObj[key]}"`;
                    }
                }
            }
            console.log(queryStr);
            const result = yield (0, cloudant_1.searchDocByIndex)({
                ddoc: 'searchIndex',
                index: 'byIndex',
                query: queryStr || '',
                bookmark: bookmark ? bookmark.toString() : undefined,
                limit: Number(limit),
                includeDocs: true,
            });
            return ResponseWarp_1.default.successX({
                total: result.total_rows,
                bookmark: result.bookmark,
                records: (_a = result.rows) === null || _a === void 0 ? void 0 : _a.map((row) => row.doc),
                previousBookmark: bookmark ? bookmark.toString() : undefined,
                limit: limit ? Number(limit) : 20,
                current: direction === 'next' ? current + 1 : current - 1,
                direction,
            });
        }
        catch (error) {
            return ResponseWarp_1.default.err(100, JSON.stringify(error));
        }
    });
}
exports.searchDocumentsPage = searchDocumentsPage;
;
