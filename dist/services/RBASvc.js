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
exports.submitRBARequest = void 0;
const ResponseWarp_1 = __importDefault(require("@shared/ResponseWarp"));
const cloudant_1 = require("../cloudant");
const BlueMailSvc_1 = require("./BlueMailSvc");
const submitRBARequest = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { doc } = params;
    try {
        let response;
        if ((doc._id && !doc._rev) || (doc._rev && !doc._id)) {
            return ResponseWarp_1.default.err(100, 'Document _id, _rev inclrrect');
        }
        if (doc._id && doc._rev) {
            response = yield (0, cloudant_1.updateDocument)(doc);
        }
        else {
            response = yield (0, cloudant_1.createNewDocument)(doc);
        }
        const rbaDoc = Object.assign(Object.assign({}, doc), { _rev: response.rev, _id: response.id });
        const emailRes = yield (0, BlueMailSvc_1.sendRBAEmails)(Object.assign(Object.assign({}, params), { hostUrlLink: `${params.hostUrlLink}${rbaDoc._id}`, doc: rbaDoc, emailKey: 'onSubmit' }));
        if (emailRes.code !== 200) {
            return ResponseWarp_1.default.err(202, "Document saved but send email failed", 'doc', rbaDoc);
        }
        return ResponseWarp_1.default.success('doc', rbaDoc);
    }
    catch (error) {
        console.log(error);
        return ResponseWarp_1.default.err(100, error.reason || '', 'errorData', error);
    }
});
exports.submitRBARequest = submitRBARequest;
