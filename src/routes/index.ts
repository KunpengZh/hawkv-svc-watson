import { Router } from 'express';
import { checkQuery } from './middleware';
import authTest from './AuthTest';

// User-router


// Export the base-router
const baseRouter = Router();
baseRouter.use('/authtest',checkQuery,authTest);
export default baseRouter;
