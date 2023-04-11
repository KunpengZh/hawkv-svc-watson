import { loadFormDocList } from '@services/formList';
import { Request, Response, Router } from 'express';


const sharedRouter = Router();

sharedRouter.post('/loadFormDocList', async (req: Request, res: Response) => {
    const queryObj = req.body;
    res.json(await loadFormDocList(queryObj));
});

export default sharedRouter;