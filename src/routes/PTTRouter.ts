import type { SubmitParams } from '@services/main';
import { Request, Response, Router } from 'express';
import { submitPTTRequest } from '../services/PTTSvc';

const pttRouter = Router();

pttRouter.post('/submitPTTRequest', async (req: Request, res: Response) => {
    const parms:SubmitParams=req.body;
    res.json(await submitPTTRequest(parms));
});

export default pttRouter;