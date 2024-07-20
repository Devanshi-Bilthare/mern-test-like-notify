const mongoose = require('mongoose')
const plm = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    name:String,
    username:String,
    email:String,
    password:String,
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    }],
    likedPosts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    }]
})


userSchema.plugin(plm)
const user = mongoose.model('user',userSchema)

module.exports = user