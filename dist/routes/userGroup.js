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
const express_1 = require("express");
const SharedSvc_1 = require("../services/SharedSvc");
const constants_1 = require("@shared/constants");
const ResponseWarp_1 = __importDefault(require("@shared/ResponseWarp"));
const sharedRouter = (0, express_1.Router)();
sharedRouter.post('/searchAllDocuments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queryObj = req.body;
    res.json(yield (0, SharedSvc_1.searchAllDocuments)(queryObj, constants_1.userGroup));
}));
sharedRouter.post('/searchDocumentsPage', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queryObj = req.body;
    res.json(yield (0, SharedSvc_1.searchDocumentsPage)(queryObj, constants_1.userGroup));
}));
sharedRouter.post('/saveOrUpdateDoc', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = req.body;
    res.json(yield (0, SharedSvc_1.saveOrUpdateDoc)(doc));
}));
sharedRouter.get('/queryByDocId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userGroupDoc = yield (0, SharedSvc_1.queryByDocId)(constants_1.USER_GROUP_DOC_ID);
        const { errorData } = userGroupDoc.data;
        if (errorData && errorData.status === 404) {
            res.json(ResponseWarp_1.default.successX({
                doc: {
                    _id: constants_1.USER_GROUP_DOC_ID,
                    docType: 'userGroup',
                    userGroups: []
                }
            }));
        }
        else {
            res.json(userGroupDoc);
        }
    }
    catch (err) {
        res.json(err);
    }
}));
sharedRouter.get('/bulkCreateDocs', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const docs = req.body;
    res.json(yield (0, SharedSvc_1.bulkCreateDocs)(docs));
}));
exports.default = sharedRouter;
