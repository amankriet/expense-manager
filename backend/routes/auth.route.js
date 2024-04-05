import { Router } from "express";
import passport from "passport";
import { login, logout, signup } from "../controllers/auth.js";

const authRouter = Router();

authRouter
  .post("/login", login)
  .post("/signup", signup)
  .get("/logout", passport.authenticate("jwt", { session: false }), logout)

export default authRouter
