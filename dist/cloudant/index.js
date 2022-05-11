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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttachment = exports.queryDocumentBydIds = exports.bulkUpdateDocuments = exports.bulkCreateDocuments = exports.updateDocument = exports.createNewDocument = exports.searchDocByIndex = exports.deleteDocuments = exports.getDocumentById = void 0;
const cloudant_1 = require("@ibm-cloud/cloudant");
const cerDBName = 'hawkv-db-ptt';
const client = cloudant_1.CloudantV1.newInstance({ serviceName: 'CLOUDANT' });
let lastExecutionTimeStamp = 0;
const isReady = (now) => {
    if ((now - lastExecutionTimeStamp) > 250) {
        lastExecutionTimeStamp = now;
        return true;
    }
    return false;
};
const sleep = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(resolve => {
        function wait() {
            let now = Date.parse(new Date().toString());
            if (isReady(now)) {
                resolve();
            }
            else {
                setTimeout(() => {
                    wait();
                }, 250);
            }
        }
        wait();
    });
});
function Cloudant() {
    return client;
}
exports.default = Cloudant;
function getDocumentById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield sleep();
        try {
            const getDocParams = {
                db: cerDBName || 'hawkv-db-ptt',
                docId: id,
            };
            const res = yield client.getDocument(getDocParams);
            if (res.status === 200) {
                return res.result || {};
            }
            throw new Error(JSON.stringify(res));
        }
        catch (error) {
            throw error;
        }
        ;
    });
}
exports.getDocumentById = getDocumentById;
function deleteDocuments(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        yield sleep();
        try {
            const res = yield client.deleteDocument(Object.assign({ db: cerDBName || 'hawkv-db-ptt' }, payload));
            return res;
        }
        catch (error) {
            throw error;
        }
        ;
    });
}
exports.deleteDocuments = deleteDocuments;
function searchDocByIndex(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        yield sleep();
        try {
            const params = Object.assign(Object.assign({}, payload), { db: cerDBName || 'hawkv-db-ptt', includeFields: payload.includeFields || [], limit: payload.limit || 20 });
            const searchRes = yield client.postSearch(params);
            if (searchRes.status === 200) {
                return searchRes.result || {};
            }
            throw new Error(JSON.stringify(searchRes));
        }
        catch (error) {
            throw error;
        }
        ;
    });
}
exports.searchDocByIndex = searchDocByIndex;
function createNewDocument(doc) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        yield sleep();
        try {
            const params = {
                db: cerDBName || 'hawkv-db-ptt',
                document: doc
            };
            const response = yield client.postDocument(params);
            if ((_a = response.result) === null || _a === void 0 ? void 0 : _a.ok) {
                return response.result;
            }
            throw new Error(JSON.stringify(response));
        }
        catch (error) {
            throw error;
        }
        ;
    });
}
exports.createNewDocument = createNewDocument;
function updateDocument(doc) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        yield sleep();
        try {
            if (!doc._id) {
                throw new Error("The document do not have a _id");
            }
            const params = {
                db: cerDBName || 'hawkv-db-ptt',
                docId: doc._id,
                document: doc
            };
            const response = yield client.putDocument(params);
            if ((_a = response.result) === null || _a === void 0 ? void 0 : _a.ok) {
                return response.result;
            }
            throw new Error(JSON.stringify(response));
        }
        catch (error) {
            throw error;
        }
        ;
    });
}
exports.updateDocument = updateDocument;
function bulkCreateDocuments(bulkDocs) {
    return __awaiter(this, void 0, void 0, function* () {
        yield sleep();
        try {
            const params = {
                db: cerDBName || 'hawkv-db-ptt',
                bulkDocs,
            };
            const response = yield client.postBulkDocs(params);
            if (response.status === 201) {
                return response.result;
            }
            throw new Error(JSON.stringify(response));
        }
        catch (error) {
            throw error;
        }
        ;
    });
}
exports.bulkCreateDocuments = bulkCreateDocuments;
function bulkUpdateDocuments(bulkDocs) {
    return __awaiter(this, void 0, void 0, function* () {
        yield sleep();
        try {
            const params = {
                db: cerDBName || 'hawkv-db-ptt',
                bulkDocs,
            };
            const response = yield client.postBulkDocs(params);
            if (response.status === 201) {
                return response.result;
            }
            throw new Error(JSON.stringify(response));
        }
        catch (error) {
            throw error;
        }
        ;
    });
}
exports.bulkUpdateDocuments = bulkUpdateDocuments;
function queryDocumentBydIds(docIds) {
    return __awaiter(this, void 0, void 0, function* () {
        yield sleep();
        try {
            if (docIds.length > 200) {
                throw new Error("The given docIds over the limited 200");
            }
            const response = yield client.postFind({
                db: cerDBName || 'hawkv-db-ptt',
                selector: {
                    "_id": {
                        "$in": docIds
                    }
                }
            });
            if (response.status === 200) {
                return response.result.docs || [];
            }
            throw new Error(JSON.stringify(response));
        }
        catch (error) {
            throw error;
        }
        ;
    });
}
exports.queryDocumentBydIds = queryDocumentBydIds;
function getAttachment(docId, attachmentName, dbName = 'cpc-cerdoc-prod') {
    return __awaiter(this, void 0, void 0, function* () {
        yield sleep();
        try {
            const response = yield client.getAttachment({
                db: dbName,
                docId: docId,
                attachmentName: attachmentName,
            });
            if (response.status === 200) {
                return response.result;
            }
            throw new Error(JSON.stringify(response));
        }
        catch (error) {
            console.log(JSON.stringify(error));
            throw error;
        }
        ;
    });
}
exports.getAttachment = getAttachment;
