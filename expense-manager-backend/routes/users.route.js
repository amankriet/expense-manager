import { Router } from "express";
import passport from "passport";
import { deleteUser, getAllUsers, getUser, updateUser } from "../controllers/user.js";
const userRouter = Router();

userRouter.use(passport.authenticate("jwt", { session: false }))

userRouter
  .get('/all', getAllUsers)
  .get('/', getUser)
  .patch('/', updateUser)
  .delete('/', deleteUser);

export default userRouter;
