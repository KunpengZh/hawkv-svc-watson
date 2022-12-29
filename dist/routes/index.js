"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("./middleware");
const SharedController_1 = __importDefault(require("./SharedController"));
const PTTRouter_1 = __importDefault(require("./PTTRouter"));
const userProfile_1 = __importDefault(require("./userProfile"));
// User-router
// Export the base-router
const baseRouter = (0, express_1.Router)();
baseRouter.use('/shared', middleware_1.adminMW, SharedController_1.default);
baseRouter.use('/ptt', middleware_1.adminMW, PTTRouter_1.default);
baseRouter.use('/userProfile', middleware_1.adminMW, userProfile_1.default);
exports.default = baseRouter;
