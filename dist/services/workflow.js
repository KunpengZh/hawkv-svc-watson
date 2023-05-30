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
exports.rejectDoc = exports.completeDoc = exports.submitDoc = void 0;
const ResponseWarp_1 = __importDefault(require("@shared/ResponseWarp"));
const BlueMailSvc_1 = require("./BlueMailSvc");
const SharedSvc_1 = require("./SharedSvc");
const constants_1 = require("@shared/constants");
const dayjs_1 = __importDefault(require("dayjs"));
const submitDoc = (doc) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield (0, SharedSvc_1.saveOrUpdateDoc)(doc);
        if (response.code !== 200) {
            return response;
        }
        const newDoc = response.data.doc;
        const emailRes = yield (0, BlueMailSvc_1.submitRequestEmail)(newDoc);
        if (emailRes.code !== 200) {
            return emailRes;
        }
        newDoc.formStatus = constants_1.formStatusObj["Pending Approval"];
        newDoc.auditTrail.push({
            who: newDoc.requester || '',
            date: (0, dayjs_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            comments: 'Submitted the document'
        });
        return yield (0, SharedSvc_1.saveOrUpdateDoc)(newDoc);
    }
    catch (error) {
        console.log(error);
        return ResponseWarp_1.default.err(100, error.reason || '', 'errorData', error);
    }
});
exports.submitDoc = submitDoc;
const completeDoc = (doc) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield (0, SharedSvc_1.saveOrUpdateDoc)(doc);
        if (response.code !== 200) {
            return response;
        }
        const newDoc = response.data.doc;
        const emailRes = yield (0, BlueMailSvc_1.completeRequestEmail)(newDoc);
        if (emailRes.code !== 200) {
            return emailRes;
        }
        newDoc.formStatus = constants_1.formStatusObj.Completed;
        newDoc.auditTrail.push({
            who: newDoc.fllEmail,
            date: (0, dayjs_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            comments: 'Approved the document'
        });
        return yield (0, SharedSvc_1.saveOrUpdateDoc)(newDoc);
    }
    catch (error) {
        console.log(error);
        return ResponseWarp_1.default.err(100, error.reason || '', 'errorData', error);
    }
});
exports.completeDoc = completeDoc;
const rejectDoc = (doc) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailRes = yield (0, BlueMailSvc_1.completeRequestEmail)(doc);
        if (emailRes.code !== 200) {
            return emailRes;
        }
        doc.formStatus = constants_1.formStatusObj.Draft;
        doc.auditTrail.push({
            who: doc.fllEmail,
            date: (0, dayjs_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            comments: 'Returned the document'
        });
        return yield (0, SharedSvc_1.saveOrUpdateDoc)(doc);
    }
    catch (error) {
        console.log(error);
        return ResponseWarp_1.default.err(100, error.reason || '', 'errorData', error);
    }
});
exports.rejectDoc = rejectDoc;
