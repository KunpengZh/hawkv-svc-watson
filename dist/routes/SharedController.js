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
const express_1 = require("express");
const SharedSvc_1 = require("../services/SharedSvc");
const sharedRouter = (0, express_1.Router)();
sharedRouter.get('/generalAppSequence', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dateStr = req.query.dateStr;
    res.json(yield (0, SharedSvc_1.generalAppSequence)(dateStr));
}));
sharedRouter.post('/searchDocuments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queryObj = req.body;
    res.json(yield (0, SharedSvc_1.searchDocuments)(queryObj));
}));
sharedRouter.post('/searchDocumentsPage', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queryObj = req.body;
    res.json(yield (0, SharedSvc_1.searchDocumentsPage)(queryObj));
}));
sharedRouter.post('/saveDoc', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = req.body;
    res.json(yield (0, SharedSvc_1.saveDoc)(doc));
}));
sharedRouter.get('/queryByDocId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const docId = req.query.docId;
    res.json(yield (0, SharedSvc_1.queryByDocId)(docId));
}));
exports.default = sharedRouter;
