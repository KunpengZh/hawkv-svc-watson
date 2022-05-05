/* eslint-disable @typescript-eslint/ban-types */
import jsonwebtoken from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { JWT_SECRET, COOKIE_EXP, WITHOUR_SECRET } from '@shared/constants';

export interface IClientData {
    uid: string;
    email:string;
    ibmToken:string;
}


const secret: string = (JWT_SECRET || WITHOUR_SECRET);
const jwtOptions: SignOptions = {
    expiresIn: COOKIE_EXP?.toString() || String(24 * 60 * 60 * 1000),
    algorithm: 'HS256'
};
const VALIDATION_ERROR: string = 'JSON-web-token validation failed.';

export function getJwt(data: IClientData): Promise<string> {
    return new Promise((resolve, reject) => {
        jsonwebtoken.sign(data, secret, jwtOptions, (err, token) => {
            err ? reject(err) : resolve(token || '');
        });
    });
}

export function decodeJwt(jwt: string): Promise<IClientData> {
    return new Promise((res, rej) => {
        jsonwebtoken.verify(jwt, secret, (err: any, decoded?: any) => {
            return err ? rej(VALIDATION_ERROR) : res(decoded as IClientData);
        });
    });
}