require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//-------------------DB----------------------

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema =  new mongoose.Schema({
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req,res) => {
  res.render("home");
});

app.get("/login", (req,res) => {
  res.render("login");
});

app.get("/register", (req,res) => {
  res.render("register");
});

app.post("/register", (req,res) => {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });

  newUser.save((err) => {
    if(err){
      console.log(err);
    } else {
      res.render("secrets");
    }
  })
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({email: username}, (err, foundUser) => {
    if(err){
      console.log(err);
    } else {
      if(foundUser){
        if(foundUser.password = password){
          res.render("secrets");
        }
      }
    }
  })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
