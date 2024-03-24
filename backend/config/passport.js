import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import "dotenv/config";
import UserModel from "../models/userModel.js";
import passport from "passport";

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;
passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      let user = await UserModel.findById(jwt_payload.id);
      let admin = false;

      if (user) {
        const { _id, firstName, lastName, email, mobileNumber, dob } = user;
        if (email == "amankriet@gmail.com") {
          admin = true;
        } else {
          admin = false;
        }
        console.log(admin);

        user = {
          id: _id,
          firstName: firstName,
          lastName: lastName,
          email: email,
          mobileNumber: mobileNumber,
          dob: dob,
          admin: admin
        };

        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (error) {
      return done(error, false);
    }
  })
);
