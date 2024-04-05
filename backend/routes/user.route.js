import { Router } from "express";
import passport from "passport";
import { deleteUserByID, getAllUsers, getUser, updateUser } from "../controllers/user.js";
const userRouter = Router();

userRouter.use(passport.authenticate("jwt", { session: false }))

userRouter
  .get("/", getAllUsers)
  .get("/:id", getUser)
  .patch("/:id", updateUser)
  .delete("/:id", deleteUserByID);

export default userRouter;
