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
    authorname:{
        type:String,
        required: true
    },
    body:{
        type:String,
        required: true
    },
    image:String,
    link:String,
    linkname:String
});

let Page = module.exports = mongoose.model('Page', pageSchema)