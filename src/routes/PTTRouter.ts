import type { SubmitParams } from '@services/main';
import { Request, Response, Router } from 'express';
import { submitPTTRequest,returnPTTRequest,completedPTTRequest } from '../services/PTTSvc';

const pttRouter = Router();

pttRouter.post('/submitPTTRequest', async (req: Request, res: Response) => {
    const parms:SubmitParams=req.body;
    res.json(await submitPTTRequest(parms));
});

pttRouter.post('/returnPTTRequest', async (req: Request, res: Response) => {
    const parms:SubmitParams=req.body;
    res.json(await returnPTTRequest(parms));
});

pttRouter.post('/completedPTTRequest', async (req: Request, res: Response) => {
    const parms:SubmitParams=req.body;
    res.json(await completedPTTRequest(parms));
});

export default pttRouter;