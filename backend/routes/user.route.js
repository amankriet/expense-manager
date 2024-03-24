import { Router } from "express";
import passport from "passport";
import { getAllUsers, getUser } from "../controllers/user.js";
import UserModel from "../models/userModel.js";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat.js";

dayjs.extend(localizedFormat);
const userRouter = Router();

userRouter
  // .get("/", getAllUsers)
  .get("/", passport.authenticate("jwt", { session: false }), getUser)
  .get("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.error) {
      res.send({
        success: false,
        message: `Unable to find user with id: ${req.params.id}`,
        error: error.toString()
      });
    } else if (req.user.admin) {
      const { _id, firstName, lastName, email, mobileNumber, dob, admin } = req.user;

      res.send({
        success: true,
        message: "User found",
        user: {
          id: _id,
          name: `${firstName} ${lastName}`,
          email: email,
          mobile: mobileNumber,
          dob: dayjs(dob).format("LL"),
          admin: admin
        }
      });
    } else {
      res.status(403).json({
        success: false,
        message: "Forbidden! Admin privileges missing",
        error: "Forbidden"
      })
    }
  })
  .patch((req, res) => {
    res.send("update current user details");
  })
  .delete((req, res) => {
    res.send("delete current user details");
  });

userRouter.param("id", async (req, res, next, id) => {
  try {
    const user = await UserModel.findById(id);
    if (user) {
      res.user = user;
    } else {
      res.error = "User not found!";
    }
  } catch (error) {
    res.error = error;
  }
  next();
})

export default userRouter;
