import type { SubmitParams } from '@services/main';
import { Request, Response, Router } from 'express';
import { submitRBARequest } from '../services/RBASvc';

const rbaRouter = Router();

rbaRouter.post('/submitRBARequest', async (req: Request, res: Response) => {
    const parms:SubmitParams=req.body;
    res.json(await submitRBARequest(parms));
});

export default rbaRouter;