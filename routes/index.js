var express = require('express');
var router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;
const saltRounds = 10;

// HOME PAGE
router.get('/',(req,res,next)=>{
  if(req.isAuthenticated()){
    res.send("LOGIN OK");
  }else{
    res.send("no ok!");
  }
})


/* Login page. */
router.route('/login')
.get((req,res,next)=>{
  res.render('login', { title: 'Đăng Nhập Trang Quản Lý' ,data:'' });
})
.post(passport.authenticate('local',{failureRedirect:'/login',successRedirect:'/',failureFlash: true}),(req,res)=>{
  res.redirect('/');
})

// dang ky
router.post('/register',(req,res,next)=>{
  let email = req.body.email;
  let password = req.body.passwordReg;
  let repassword = req.body.repasswordReg;

  req.checkBody('email','Email không hợp lệ').isEmail();
  req.checkBody('passwordReg','Password không được trống').notEmpty();
  req.checkBody('repasswordReg','Pass không chính xác').equals(req.body.passwordReg);
  var arrErr = req.validationErrors();

  if(arrErr){
    req.session.data = arrErr;
    res.render('login',{title: 'Đăng Nhập Trang Quản Lý' ,data:arrErr});
  }else{
    User.findOne({email:email},(err,docs)=>{
      if(docs){
        console.log(docs);
        res.render('login',{title: 'Đăng Nhập Trang Quản Lý' ,data:[{msg:"Email đã tồn tại !"}]})
      }else{
        var objUser = User({
                              email:email,
                              password:password,
                              checkRole:true
                           });
        bcrypt.hash(objUser.password,saltRounds,(err,hash)=>{
          objUser.password = hash;
          objUser.save((err,data)=>{
            if(err){
              res.render('login',{title: 'Đăng Nhập Trang Quản Lý' ,data:[{msg:err}]})
            }else{
              res.render('login',{title: 'Đăng Nhập Trang Quản Lý' ,data:[{msg:"Thành Công!"}]})
            }
          })
        });
      }
    })
  }
 
});

//PASSPORT CONFIG
passport.use(new LocalStrategy((username,password, done)=>{
  User.findOne({email:username},(err,user)=>{
    if(err) return done(err);
    if(!user) return done(null,false,{message:"Account incorrect !"});
    bcrypt.compare(password,user.password,(err,flag)=>{
      if(err) throw err ;
      if(flag){
        return done(null,user);
      }else{
        return done(null,false,{message:"Account incorrect !"});
      }
    })
  })
}));

passport.serializeUser((user,done)=>{
  done(null,user.id);
})
passport.deserializeUser((id,done)=>{
  User.findById(id,(err,user)=>{
    console.log(id);
    done(err,user);
  })
})


//export module
module.exports = router;
