import express from "express";

const user = express.Router();

user.get("/", (req, res) => {
  res.send("get all users details");
});

user.get("/:id", (req, res) => {
  res.send("getting info for current user");
});

user.post("/", (req, res) => {
  res.send("User Created");
});

user.patch("/:id", (req, res) => {
  res.send("update current user details");
});

user.delete("/:id", (req, res) => {
  res.send("delete current user details");
});

user.delete("/", (req, res) => {
  res.send("delete all user details");
});

export default user;
