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
const workflow_1 = require("../services/workflow");
const sharedRouter = (0, express_1.Router)();
sharedRouter.post('/submitDoc', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const formDoc = req.body;
        res.json(yield (0, workflow_1.submitDoc)(formDoc));
    });
});
sharedRouter.post('/completeDoc', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const formDoc = req.body;
        res.json(yield (0, workflow_1.completeDoc)(formDoc));
    });
});
sharedRouter.post('/rejectDoc', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const formDoc = req.body;
        res.json(yield (0, workflow_1.rejectDoc)(formDoc));
    });
});
exports.default = sharedRouter;
