import {ExtractJwt, Strategy as JwtStrategy} from "passport-jwt"
import UserModel from "../models/UserModel.js"
import passport from "passport"
import {ERROR_LOGS_FILE, EXCLUDED_FIELDS} from "../utils/common.js"
import logger from "../middlewares/logger.js";

const cookieExtractor = function (req) {
    let token = null;
    console.log('cookieReq',req.cookies['jwt'])
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    console.log('token',token)
    return token;
};

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), cookieExtractor])
opts.secretOrKey = process.env.JWT_SECRET_KEY

passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
        try {
            // noinspection JSCheckFunctionSignatures
            let user = await UserModel.findById(jwt_payload.id)
                .select(EXCLUDED_FIELDS)

            if (user) {
                return done(null, user)
            } else {
                logger("Invalid Access Token")
                return done(null, false)
                // or you could create a new account
            }
        } catch (error) {
            logger(`${error.name} ${error.message}`, ERROR_LOGS_FILE)
            return done(error, false)
        }
    })
)
