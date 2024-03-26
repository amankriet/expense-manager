import { Router } from "express";
import passport from "passport";
import { getAllUsers, getIdUser, getUser } from "../controllers/user.js";
const userRouter = Router();

userRouter
  .get("/", passport.authenticate("jwt", { session: false }), getAllUsers)
  .get("/user", passport.authenticate("jwt", { session: false }), getUser)
  .get("/:id", passport.authenticate("jwt", { session: false }), getIdUser)
  .patch((req, res) => {
    res.send("update current user details");
  })
  .delete((req, res) => {
    res.send("delete current user details");
  });

export default userRouter;
