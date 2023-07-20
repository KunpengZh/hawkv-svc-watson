"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shared_1 = __importDefault(require("./shared"));
// Export the base-router
const baseRouter = (0, express_1.Router)();
baseRouter.use('/shared', shared_1.default);
exports.default = baseRouter;
