import { Request, Response, Router } from 'express';
import { getBoardList } from '../services/SharedSvc';
const sharedRouter = Router();

sharedRouter.get('/getBoardList', async (req: Request, res: Response) => {
    const docId: string = req.query.docId as string;
    res.json(await getBoardList());
});


export default sharedRouter;