"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoardList = void 0;
const ResponseWarp_1 = __importDefault(require("@shared/ResponseWarp"));
function getBoardList() {
    return ResponseWarp_1.default.successX([
        {
            title: 'ASEAN Board'
        },
        {
            title: 'GCG Board'
        }
    ]);
}
exports.getBoardList = getBoardList;
