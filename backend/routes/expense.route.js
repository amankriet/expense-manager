import { Router } from "express";

const expenseRouter = Router();

expenseRouter
  .get("/", (req, res) => {
    res.send("fetch all expenses of current user");
  })
  .get("/:id", (req, res) => {
    res.send("fetch expense of current user");
  })
  .post("/", (req, res) => {
    res.send("create new expenses for current user");
  })
  .patch("/:id", (req, res) => {
    res.send("update the existing expense of current user");
  })
  .delete("/:id", (req, res) => {
    res.send("remove the expense from current user");
  })
  .delete("/", (req, res) => {
    res.send("remove all the expenses from current user");
  });

export default expenseRouter;
