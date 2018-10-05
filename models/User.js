//NodeJS third-party modules
const {Schema} = require('mongoose');

//Create schema
    const UserSchema = new Schema({
        name:{
            type: String,
            required: true
        },
        email: {
            type: String,
            required:  true
        },
        password: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now()
        }
    });

//Module exports    
    module.exports = {
        UserSchema
    };

