//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { userInfo } = require("os");
const encrypt = require("mongoose-encryption");
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/userdb",{ useNewUrlParser: true });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


const UserSchema = new mongoose.Schema({
    email:String,
    password: String
});
const secret = "Thisismynewsecret";
UserSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});

const User = new mongoose.model("User",UserSchema);
app.get("/", function(req,res){
    res.render("Home");
});


app.get("/login", function(req,res){
    res.render("Login");
});

app.post("/register", function(req , res){
    const Newuser = new User({
        email: req.body.username,
        password: req.body.password
    });
    Newuser.save()
    .then (function (){
            res.render("secrets");
    })
    .catch(function (err) {
         console.log(err);
    })
});

app.get("/register",  function(req,res){
    res.render("Register");
});
app.post("/login", async function (req, res){

const username = req.body.username;
const password = req.body.password;
console.log(username);
console.log(password);
await User.findOne({email:username})
.then (function(userfound){
    console.log(userfound);
  if (userfound){
    if (userfound.password === password){
        res.render("secrets");
    }
    else{
        console.log("no user found");
    }

  }
})
.catch(function(err){
    console.log(err)
})

});

app.listen(3000,function(){
    console.log("Server is running on port 3000.");
});