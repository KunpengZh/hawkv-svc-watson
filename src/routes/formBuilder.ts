import { Request, Response, Router } from 'express';
import { loadFormTemplateList } from '../services/formBuilder';
import { HAWK_TOKEN, byIndex } from '@shared/constants';
import ResponseWarp from '@shared/ResponseWarp';
import { decodeJwt } from '@shared/JwtService';

const sharedRouter = Router();

sharedRouter.get('/loadFormTemplateList', async (req: Request, res: Response) => {
    // Get json-web-token
    const jwt = req.headers[HAWK_TOKEN];
    if (!jwt) {
        res.json(ResponseWarp.err(401, 'JWT not present in signed cookie.'))
        return;
    }
    // Make sure user role is an admin
    const userData = await decodeJwt(jwt.toString());
    
    res.json(await loadFormTemplateList(userData));
});

export default sharedRouter;