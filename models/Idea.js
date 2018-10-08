//NodeJS third-party modules
    const {Schema} = require('mongoose');

//Create schema
    const IdeaSchema = new Schema({
        title:{
            type: String,
            required: true
        },
        details: {
            type: String,
            required:  true
        },
        user: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now()
        },
    });

//Module exports    
    module.exports = {
        IdeaSchema
    };    
// model = mongoose.model('ideas', IdeaSchema) 