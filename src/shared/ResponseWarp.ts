export interface ResponseWarpType {
    code: number,
    msg?: string,
    data?: any
}

export default class ResponseWarp {
    constructor() { }
    static success(key: string = 'data', data: any = [], msg: string = ''): ResponseWarpType {
        return {
            code: 200,
            msg: msg,
            data: {
                [key]: data
            }
        };
    }
    static successX(data: any = {}, msg: string = ''): ResponseWarpType {
        return {
            code: 200,
            msg: msg,
            data: {
                ...data
            }
        };
    }
    static err(code: number = 100, msg: string = '', key: string = 'data', data: any = []): ResponseWarpType {
        return {
            code,
            msg,
            data: {
                [key]: data
            }
        };
    }
}

