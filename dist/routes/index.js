"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("./middleware");
const shared_1 = __importDefault(require("./shared"));
const userGroup_1 = __importDefault(require("./userGroup"));
const userProfile_1 = __importDefault(require("./userProfile"));
const fileUploadRouter_1 = __importDefault(require("./fileUploadRouter"));
const fileDownloadRouter_1 = __importDefault(require("./fileDownloadRouter"));
// Export the base-router
const baseRouter = (0, express_1.Router)();
baseRouter.use('/shared', middleware_1.adminMW, shared_1.default);
baseRouter.use('/userGroup', middleware_1.adminMW, userGroup_1.default);
baseRouter.use('/userProfile', middleware_1.adminMW, userProfile_1.default);
baseRouter.use('/files', middleware_1.adminMW, fileUploadRouter_1.default);
baseRouter.use('/download', middleware_1.checkQuery, fileDownloadRouter_1.default);
exports.default = baseRouter;
