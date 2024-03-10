import { Router } from "express";

const authRouter = Router();

authRouter
  .post("/login", (req, res) => {
    res.send("Login Page");
  })
  .post("/signup", (req, res) => {
    res.send("Signup Page");
  });

export default authRouter;
