import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * Registers passport's middleware to intercept 'authorized' users
 *
 * @param passport The passport object the server is using
 */
export default function register(passport) {
    const opts = {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeader()
    };
    passport.use(new Strategy(opts, function(payload, done) {
        return done(null, payload);
    }));
};
