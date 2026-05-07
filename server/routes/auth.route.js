import { Router } from 'express';
import passport from 'passport';
import { handleRefreshToken, login, logout, logoutAll, signup } from '../controllers/auth.js';
import { verifyRefreshToken } from '../middlewares/verifyRefreshToken.js';
import { authLimiter } from '../middlewares/rateLimit.js';

const authRouter = Router()
authRouter.use(authLimiter)

authRouter
  .post('/login', login)
  .post('/signup', signup)
  .get('/logout', logout)
  .get('/logout-all', logoutAll)
  .get("/refresh-token", verifyRefreshToken, handleRefreshToken);

export default authRouter
