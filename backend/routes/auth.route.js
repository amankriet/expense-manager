import { Router } from "express";
import { login, logout, signup } from "../controllers/auth.js";

const authRouter = Router();

authRouter
  .post("/login", login)
  .post("/signup", signup)
  .get("/logout", logout);

export default authRouter;
