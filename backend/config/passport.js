import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import UserModel from "../models/UserModel.js";
import passport from "passport";

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;
passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      let user = await UserModel.findById(jwt_payload.id);

      if (user) {
        const { _id, firstName, lastName, email, mobile, dob, role } = user;

        user = {
          id: _id,
          firstName: firstName,
          lastName: lastName,
          email: email,
          mobile: mobile,
          dob: dob,
          role: role
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
