const { User } = require("../models");
const { randomBytes } = require("crypto");

const login = async (req, res) => {
  const username = req.body.username
  const password = require("crypto").createHash("sha256").update(req.body.password).digest("hex")

  User.findOne({username:username}, function(err, foundUser){
    if(err){
      res.send(err)
    }else{
      if(foundUser.password === password){
          res.status(200).json(foundUser)
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

  const newUser = new User({
    email: email,
    username :username,
    password : require("crypto").createHash("sha256").update(password).digest("hex")
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

module.exports = { login, signup, profile };
