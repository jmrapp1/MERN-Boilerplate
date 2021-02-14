import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserWebModule } from './index';

/**
 * Registers passport's middleware to intercept 'authorized' users
 *
 * @param passport The passport object the server is using
 */
export function registerPassportJwt(passport) {
    const opts = {
        secretOrKey: UserWebModule.context.moduleOptions.jwtSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeader()
    };
    passport.use(new Strategy(opts, function(payload, done) {
        return done(null, payload);
    }));
};
