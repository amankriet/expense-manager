import express from "express";

const expense = express.Router();

expense.get("/", (req, res) => {
  res.send("fetch all expenses of current user");
});

expense.get("/:id", (req, res) => {
  res.send("fetch expense of current user");
});

expense.post("/", (req, res) => {
  res.send("create new expenses for current user");
});

expense.patch("/:id", (req, res) => {
  res.send("update the existing expense of current user");
});

expense.delete("/:id", (req, res) => {
  res.send("remove the expense from current user");
});

expense.delete("/", (req, res) => {
  res.send("remove all the expenses from current user");
});

export default expense;
