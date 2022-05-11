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
const PTTSvc_1 = require("../services/PTTSvc");
const pttRouter = (0, express_1.Router)();
pttRouter.post('/submitPTTRequest', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parms = req.body;
    res.json(yield (0, PTTSvc_1.submitPTTRequest)(parms));
}));
pttRouter.post('/returnPTTRequest', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parms = req.body;
    res.json(yield (0, PTTSvc_1.returnPTTRequest)(parms));
}));
pttRouter.post('/completedPTTRequest', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parms = req.body;
    res.json(yield (0, PTTSvc_1.completedPTTRequest)(parms));
}));
exports.default = pttRouter;
