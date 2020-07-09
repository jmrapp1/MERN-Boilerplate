import { ExtractJwt, Strategy } from 'passport-jwt';
import { ModuleContext } from './index';

/**
 * Registers passport's middleware to intercept 'authorized' users
 *
 * @param passport The passport object the server is using
 */
export function registerPassportJwt(passport) {
    const opts = {
        secretOrKey: ModuleContext.getTokenSecret(),
        jwtFromRequest: ExtractJwt.fromAuthHeader()
    };
    passport.use(new Strategy(opts, function(payload, done) {
        return done(null, payload);
    }));
};
