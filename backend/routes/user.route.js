import { Router } from "express";
import passport from "passport";
import { getAllUsers, getUser } from "../controllers/user.js";

const userRouter = Router();

userRouter
  .get("/", getAllUsers)
  .get("/:id", passport.authenticate("jwt", { session: false }), getUser)
  .post("/", (req, res) => {
    res.send("User Created");
  })
  .patch("/:id", (req, res) => {
    res.send("update current user details");
  })
  .delete("/:id", (req, res) => {
    res.send("delete current user details");
  })
  .delete("/", (req, res) => {
    res.send("delete all user details");
  });

export default userRouter;
