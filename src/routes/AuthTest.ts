import { Request, Response, Router } from 'express';
import ResponseWarp from '@shared/ResponseWarp';

const testRouter = Router();

testRouter.get("/verify", function (req: Request, res: Response) {
    res.json(ResponseWarp.success("msg","Authorication Verification successfully"))
});



export default testRouter;