const { User } = require("../models");
const { randomBytes } = require("crypto");
const fs = require('fs');
const path = require('path');

const login = async (req, res) => {
  const email = req.body.email
  const password = require("crypto").createHash("sha256").update(req.body.password).digest("hex")

  User.findOne({email:email}, function(err, foundUser){
    if(err){
      res.send(err)
    }else{
      if(foundUser.password === password){
        foundUser.login = true
        foundUser.save()
        res.render("secrets.ejs", {user:foundUser})
      }else{
        res.status(404).send("User Not Found");
      }
    }
  })
};

const signup = async (req, res) => {

  const username = req.body.username
  const email = req.body.email
  const password = req.body.password
  
  //
  const img = req.file.filename;
  //

  const newUser = new User({
    email: email,
    username :username,
    password : require("crypto").createHash("sha256").update(password).digest("hex"),
    login: true,
    img:img
  })

  newUser.save(function(err){
    if(err){
      res.send(err)
    }else{
      res.render("secrets.ejs",{user: newUser})
    }
  })

};

const profile = async (req, res) => {

  const username = req.body.username;

  User.findOne({username:username}, function(err, foundUser){
      if(!foundUser){
          res.send(err)
      }
      else{
          res.status(200).json(foundUser)
      }
  })
};

const logout = async (req, res) => {
  const username = req.params.username;

  User.findOne({username:username}, function(err, foundUser){
      if(!foundUser){
          res.send(err)
      }
      else{
          foundUser.login = false
          foundUser.save()
          res.redirect("/")
      }
  })
};

module.exports = { login, signup, profile, logout };
