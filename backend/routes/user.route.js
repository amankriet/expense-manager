import { Router } from "express";
import passport from "passport";
import { deleteUserByID, getAllUsers, getUser, updateUser } from "../controllers/user.js";
const userRouter = Router();

userRouter
  .get("/", passport.authenticate("jwt", { session: false }), getAllUsers)
  .get("/:id", passport.authenticate("jwt", { session: false }), getUser)
  .patch("/:id/update", passport.authenticate("jwt", { session: false }), updateUser)
  .delete("/:id/delete", passport.authenticate("jwt", { session: false }), deleteUserByID);

export default userRouter;
