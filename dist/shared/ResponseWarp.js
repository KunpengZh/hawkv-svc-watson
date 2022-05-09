"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseWarp {
    constructor() { }
    static success(key = 'data', data = [], msg = '') {
        return {
            code: 200,
            msg: msg,
            data: {
                [key]: data
            }
        };
    }
    static successX(data = {}, msg = '') {
        return {
            code: 200,
            msg: msg,
            data: Object.assign({}, data)
        };
    }
    static err(code = 100, msg = '', key = 'data', data = []) {
        return {
            code,
            msg,
            data: {
                [key]: data
            }
        };
    }
}
exports.default = ResponseWarp;
