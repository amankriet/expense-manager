import passport from "passport";
import { Strategy as JWTStrategy } from "passport-jwt";

passport.use(new JWTStrategy("secret"));
