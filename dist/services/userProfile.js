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
exports.bulkCreateUserProfiles = exports.updateUserProfile = exports.createUserProfile = exports.loadUserProfileList = exports.loadAllUserProfiles = void 0;
const cloudant_1 = require("../cloudant");
const ResponseWarp_1 = __importDefault(require("../shared/ResponseWarp"));
const constants_1 = require("../shared/constants");
/**一次拉取所有的用户Profile */
function loadAllUserProfiles() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'docType:"userProfile"';
        let nBookmark = undefined;
        const userProfiles = [];
        do {
            const result = yield (0, cloudant_1.searchDocByIndex)({
                ddoc: constants_1.cloudantDDoc,
                index: 'userProfile',
                query: query,
                bookmark: nBookmark ? nBookmark : undefined,
                limit: 200,
                includeDocs: true,
            });
            const { bookmark, rows } = result;
            rows === null || rows === void 0 ? void 0 : rows.forEach(row => {
                const { doc } = row;
                if (doc) {
                    userProfiles.push({
                        userRole: doc.userRole,
                        uid: doc.uid,
                        emailAddress: doc.emailAddress,
                        preferred_username: doc.preferred_username,
                        userName: doc.userName,
                        isActive: doc.isActive,
                    });
                }
            });
            nBookmark = bookmark && bookmark !== nBookmark ? bookmark : undefined;
        } while (nBookmark);
        return ResponseWarp_1.default.successX({ userProfiles });
    });
}
exports.loadAllUserProfiles = loadAllUserProfiles;
function loadUserProfileList(payload) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { limit, bookmark, current = 0, direction = 'next', userRole, emailAddress } = payload;
            let query = 'docType:"userProfile"';
            if (userRole) {
                query = `${query} AND userRole:"${userRole}"`;
            }
            if (emailAddress) {
                query = `${query} && emailAddress:"${emailAddress}"`;
            }
            const result = yield (0, cloudant_1.searchDocByIndex)({
                ddoc: 'searchIndex',
                index: 'userProfile',
                query: query,
                bookmark: bookmark ? bookmark.toString() : undefined,
                limit: limit ? Number(limit) : 20,
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
exports.loadUserProfileList = loadUserProfileList;
;
function createUserProfile(userProfile) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!userProfile || userProfile._id) {
                return ResponseWarp_1.default.err(100, 'userProfile format incorrect');
            }
            const creationRes = yield (0, cloudant_1.createNewDocument)(userProfile);
            return ResponseWarp_1.default.successX(Object.assign(Object.assign({}, userProfile), { _id: creationRes.id, _rev: creationRes.rev }));
        }
        catch (error) {
            return ResponseWarp_1.default.err(100, JSON.stringify(error));
        }
    });
}
exports.createUserProfile = createUserProfile;
;
function updateUserProfile(userProfile) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!userProfile || !userProfile._id) {
                return ResponseWarp_1.default.err(100, 'userProfile format incorrect');
            }
            const updateRes = yield (0, cloudant_1.updateDocument)(userProfile);
            return ResponseWarp_1.default.successX(Object.assign(Object.assign({}, userProfile), { _rev: updateRes.rev }));
        }
        catch (error) {
            return ResponseWarp_1.default.err(100, JSON.stringify(error));
        }
    });
}
exports.updateUserProfile = updateUserProfile;
;
function bulkCreateUserProfiles(userProfiles) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield (0, cloudant_1.bulkCreateDocuments)({ docs: userProfiles });
        }
        catch (error) {
            return ResponseWarp_1.default.err(100, JSON.stringify(error));
        }
    });
}
exports.bulkCreateUserProfiles = bulkCreateUserProfiles;
;
