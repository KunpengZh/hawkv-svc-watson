import { Router } from 'express';
import { checkQuery,adminMW } from './middleware';
import authTest from './AuthTest';
import sharedRouter from './SharedController';
import rbaRouter from './RBARouter';

// User-router


// Export the base-router
const baseRouter = Router();
baseRouter.use('/shared', adminMW, sharedRouter);
baseRouter.use('/authtest',checkQuery,authTest);
baseRouter.use('/rba',adminMW,rbaRouter);
export default baseRouter;
