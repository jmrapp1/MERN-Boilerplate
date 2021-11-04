import { ExtractJwt, Strategy } from 'passport-jwt';
import User from "../models/User";
import UserService from "../services/UserService";
import {Container} from "typedi";

/**
 * Registers passport's middleware to intercept 'authorized' users
 *
 * @param passport The passport object the server is using
 */
export default function register(passport) {
    const userService = Container.get(UserService);
    const opts = {
        secretOrKey: process.env.PASSPORT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    };
    passport.use(new Strategy(opts, async function(payload, done) {
        try {
            const user = await userService.findById(payload._id);
            return done(null, user.data);
        } catch (e) {
            return done(null, false);
        }
    }));
};
