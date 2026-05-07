import { Router } from "express";
import passport from "passport";
import { deleteUser, getAllUsers, getUser, updateUser } from "../controllers/user.js";
import { apiLimiter } from "../middlewares/rateLimit.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";
const userRouter = Router();

userRouter.use(passport.authenticate("jwt", { session: false }))
userRouter.use(apiLimiter)

userRouter
  .get('/all', getAllUsers)
  .get('/', getUser)
  .patch('/', updateUser)
  .delete('/', validateObjectId, deleteUser);

export default userRouter;
