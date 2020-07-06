import * as passport from 'passport';

export default passport.authenticate(['jwt', 'anonymous'], { session: false })
