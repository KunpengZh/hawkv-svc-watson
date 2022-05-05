import StatusCodes from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { decodeJwt } from '@shared/JwtService';
import { HAWK_TOKEN } from '@shared/constants';
const { UNAUTHORIZED } = StatusCodes;

// Middleware to verify if user is an admin
export const adminMW = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get json-web-token
        const jwt = req.headers[HAWK_TOKEN];
        if (!jwt) {
            throw Error('JWT not present in signed cookie.');
        }
        // Make sure user role is an admin
        await decodeJwt(jwt.toString());
        next();

        // if (clientData.role === UserRoles.Admin) {
        //     res.sessionUser = clientData;

        // } else {
        //     throw Error('JWT not present in signed cookie.');
        // }
    } catch (err: any) {
        return res.status(UNAUTHORIZED).json({
            error: err.message,
        });
    }
};

export const checkQuery = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {accessToken}=req.query;
        // Get json-web-token
        if (!accessToken) {
            throw Error('JWT not present in signed cookie.');
        }
        // Make sure user role is an admin
        const clientData = await decodeJwt(accessToken.toString());
        next();
    } catch (err:any) {
        return res.status(UNAUTHORIZED).json({
            error: "Your are not authorized to access this page",
        });
    }
};
