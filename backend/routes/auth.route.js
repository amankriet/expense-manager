import { Router } from "express";
import { login, signup } from "../controllers/auth.js";

const authRouter = Router();

authRouter
  .post("/login", login)
  .post("/signup", signup)
  .get("/logout", (req, res) => {
    res.send("Logged Out");
  });

export default authRouter;
