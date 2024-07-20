const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title:String,
    desc:String,
    image:String,
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }]
})


const post = mongoose.model('post',postSchema)

module.exports = post