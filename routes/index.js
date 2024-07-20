var express = require('express');
var router = express.Router();

const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('../models/userModel')
const Post = require('../models/PostModel')
const sendMail = require('../utils/mail')

passport.use(new localStrategy(User.authenticate()))

/* GET home page. */
router.get('/',isLoggedIn,async function(req, res, next) {
  try{
    const posts = await Post.find()

    res.render('index',{posts});
  }catch(err){
    res.send(err)
  }
  
});

router.get('/register',(req,res)=>{
  res.render('register')
})

router.post('/register',async(req,res)=>{
  try{
    const {name,username,email,password} = req.body
    await User.register({name,username,email},password)
    res.redirect('/login')
  }catch(err){
    res.send(err)
  }
})

router.get('/login',(req,res)=>{
  res.render('login')
})

router.post('/login',passport.authenticate('local',{
  successRedirect:'/',
  failureRedirect:'/login'
}),(req,res)=>{})

router.get('/create',isLoggedIn,(req,res)=>{
  res.render('create')
})

router.post('/create',isLoggedIn,async(req,res)=>{
  try{
    const {title,desc,image} = req.body
    const newPost =await new Post({
      title,desc,image,
      createdBy:req.user._id
    })

    await req.user.posts.push(newPost._id)
    newPost.save()
    req.user.save()
    res.redirect('/')
  }catch(err){
    res.send(err)
  }
})


router.get('/like/:id',async(req,res)=>{
  try{
    const {id} = req.params
    const post = await Post.findById(id)
    const userId = await post.populate('createdBy')
    if(!post.likes.includes(req.user._id)){
      await post.likes.push(req.user._id)
      req.user.likedPosts.push(id)
      sendMail(res,userId)
    }else{
      const idx =await post.likes.indexOf(req.user._id)
      post.likes.splice(idx,1)
      const idx2 =await req.user.likedPosts.indexOf(id)
      req.user.likedPosts.splice(idx2,1)
    }
    
    req.user.save()
    post.save()
    
    res.redirect('/')
  }catch(err){
    res.send(err)
  }
})




function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    next()
  }else{
    res.redirect('/login')
  }
}

module.exports = router;
