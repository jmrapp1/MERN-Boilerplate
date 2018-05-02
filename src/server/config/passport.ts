import { ExtractJwt, Strategy } from 'passport-jwt';
import Config from './config';

/**
 * Registers passport's middleware to intercept 'authorized' users
 *
 * @param passport The passport object the server is using
 */
export default function register(passport) {
    const opts = {
        secretOrKey: Config.secret,
        jwtFromRequest: ExtractJwt.fromAuthHeader()
    };
    passport.use(new Strategy(opts, function(payload, done) {
        return done(null, payload);
    }));
};
