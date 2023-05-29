"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CacheService {
    constructor() {
        this.cache = new Map();
    }
    set(key, value) {
        this.cache.set(key, value);
    }
    get(key) {
        return this.cache.get(key);
    }
    clear(key) {
        if (key) {
            this.cache.delete(key);
        }
        else {
            this.cache.clear();
        }
    }
}
exports.default = new CacheService();
