//NodeJS third-party modules
    const {Strategy} = require('passport-local');
    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs');

//Load user model
    const User = mongoose.model('users');

//Module exports
    module.exports = (passport) => {
        passport.use(new Strategy(
            {usernameField: 'email'},
            (email, password, done) => {
                // Match user
                User.findOne({email})
                    .then((user) => {
                        if (!user) {
                            return done(null, false, {message: 'No user was found'});
                        }
                        //Match password
                        bcrypt.compare(password, user.password, (err, isMatch) => {
                            //If an error occured
                            if (err) throw err;
                            //If password match
                            if (isMatch) {
                                return done(null, user)
                            //If password mismatch
                            } else {
                                return done(null, false, {message: 'Password Incorrect'});
                            }
                        });
                    });
            }));

        passport.serializeUser((user, done) => {
            done(null, user.id);
        });
            
        passport.deserializeUser((id, done) => {
            User.findById(id, (err, user) => {
                done(err, user);
            });
        });
    }