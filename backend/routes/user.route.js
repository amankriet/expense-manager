import { Router } from "express";

const userRouter = Router();

userRouter
  .get("/", (req, res) => {
    res.send("get all users details (test)");
  })
  .get("/:id", (req, res) => {
    res.send("getting info for current user");
  })
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
