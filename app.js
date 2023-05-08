const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
var encrypt = require('mongoose-encryption');
require('dotenv').config()
const app = express()


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//mongoose.connect("mongodb+srv://"+process.env.USER+":"+process.env.PASSWORD+"@personalblog.rvcwuw4.mongodb.net/?retryWrites=true&w=majority/blogDB").then(() => console.log('Connected!')).catch((err)=>{console.log(err)});
mongoose.connect("mongodb://127.0.0.1:27017/userDB").then(() => console.log('Connected!')).catch((err)=>{console.log(err)});

const userSchema = new mongoose.Schema({
  email:{
    type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
      },
  password:{
    type: String,
  }
});

const secret = process.env.SECRET

userSchema.plugin(encrypt,{secret: secret, encryptedFields:["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", (req,res)=>{
  res.render("home")
});
app.get("/login", (req,res)=>{
  res.render("login")
});
app.get("/register", (req,res)=>{
  res.render("register")
});

app.post("/register", (req,res)=>{
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })

  newUser.save().then((newUser,err)=>{console.log(err)}).then(res.render("secrets")).catch((err)=>{console.log(err)})
})

app.post("/login", (req,res)=>{

  const username =  req.body.username
  const password = req.body.password

  User.findOne({email:username}).then((foundUser,err)=>{
    if(err){
      console.log(err)
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets")
        }
      }
    }
  }).catch((err)=>{console.log(err)})

  
})


app.listen(process.env.PORT || 3000 , function () {
    console.log("Server started on port 3000");
  });


