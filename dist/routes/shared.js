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
sharedRouter.get('/getBoardList', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const docId = req.query.docId;
    res.json(yield (0, SharedSvc_1.getBoardList)());
}));
exports.default = sharedRouter;
