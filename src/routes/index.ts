import { Router } from 'express';
import { checkQuery,adminMW } from './middleware';
import authTest from './AuthTest';
import sharedRouter from './SharedController';
import pttRouter from './PTTRouter';

// User-router


// Export the base-router
const baseRouter = Router();
baseRouter.use('/shared', adminMW, sharedRouter);
baseRouter.use('/authtest',checkQuery,authTest);
baseRouter.use('/ptt',adminMW,pttRouter);
export default baseRouter;
