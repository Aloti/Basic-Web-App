let mongoose = require('mongoose');

let articleSchema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    author:{
        type:String,
        required: true
    },
    body:{
        type:String,
        required: true
    },
    images:[String],
    links:[String]
});

let Page = module.exports = mongoose.model('Page', pageSchema)