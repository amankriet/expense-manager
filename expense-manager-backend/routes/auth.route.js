import { Router } from 'express';
import passport from 'passport';
import {handleRefreshToken, login, logout, signup} from '../controllers/auth.js';

const authRouter = Router();

authRouter
  .post('/login', login)
  .post('/signup', signup)
  .get('/logout', passport.authenticate("jwt", { session: false }), logout)
  .get('/refresh-token', passport.authenticate('jwt', { session: false }), handleRefreshToken)

export default authRouter
