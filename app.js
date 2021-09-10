// jshint esversion:6

require("dotenv").config();
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const session = require("express-session")
var passport = require('passport')
const passportLocalMongoose = require("passport-local-mongoose")

var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        const name = file.originalname.replace(" ", "-") 
        cb(null, Date.now() + "-" + name)
    }
  });
  
var upload = multer({ storage: storage });

const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname + "/public"))

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set("useCreateIndex", true)

const usersSchema = new mongoose.Schema({
    email: String,
    fName: String,
    lName: String,
    password: String,
    image: String,
    todo: [ {type: String} ]
})

usersSchema.plugin(passportLocalMongoose)

const User = mongoose.model("User", usersSchema)

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", function(req, res){
    if(req.isAuthenticated()){
        res.render("home", {log: true})
    }else{
        res.render("home", {log : false})
    }
})

app.get("/login", function(req, res){
    if(req.isAuthenticated()){
        res.redirect("/")
    }else{
        res.render("login", {log : false})
    }
})

app.post("/login", function(req, res){
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err){
        if(err){

        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/")
            })
        }
    })
})

app.get("/register", function(req, res){
    if(req.isAuthenticated()){
        res.redirect("/")
    }else{
        res.render("register", {log : false})
    }
})

app.post("/register", upload.single('image'), function(req, res){

    User.register({username: req.body.username, fName: req.body.fname, lName: req.body.lname, image: req.file.filename}, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/register")
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/")
            })
        }
    })
})

app.get("/logout", function(req, res){
    req.logOut()
    res.redirect("/")
})

app.get("/todo", function (req, res) {
    
    if(req.isAuthenticated()){
        res.render("todo.ejs", {newListItem: req.user.todo, log : true})
    }else{
        res.redirect("/login")
    }
})

app.post("/todo", async function (req, res) {
    
    if(req.isAuthenticated()){
        // res.render("todo.ejs", {newListItem: req.user.todo})
        await User.find({username:req.user.username}, async function(err, foundArticle){
            if(foundArticle){
                foundArticle[0].todo.push( req.body.newItem )
                await foundArticle[0].save()
                res.redirect("/todo")
            }
            else{
                res.send("No article found with the title")
            }
        })
    }else{
        res.redirect("/login")
    }
})

app.post("/todo/delete", async function (req, res) {
    
    const checkedItem = req.body.checkbox;
    await User.find({username:req.user.username}, async function(err, foundArticle){
        if(foundArticle){
            foundArticle[0].todo.splice(checkedItem, 1);
            await foundArticle[0].save()
            res.redirect("/todo")
        }
        else{
            res.send("No article found with the title")
        }
    })
})

app.get("/profile", function(req, res){
    if(req.isAuthenticated()){
        res.render("profile.ejs", { user:req.user, msg: "", log : true} )
    }
    else{
        res.redirect("/login")
    }
})

app.post("/profile", async function(req, res){

    var msg = ''
    if(req.body.username !== '' && req.body.username !== req.user.username){
        await User.find({_id: req.user._id}, async function(err, foundUser){
                    foundUser[0].username = req.body.username
                    msg = msg.concat("Email Updated! ")
                    await foundUser[0].save()
        })
    }

    if(req.body.fName !== '' && req.body.fName !== req.user.fName){
        await User.find({_id: req.user._id}, async function(err, foundUser){
                    foundUser[0].fName = req.body.fName
                    msg = msg.concat(" First Name Updated! ")
                    await foundUser[0].save()
        })
    }
    if(req.body.lName !== '' && req.body.lName !== req.user.lName){
        await User.find({_id: req.user._id}, async function(err, foundUser){
                    foundUser[0].lName = req.body.lName
                    msg = msg.concat(" Last Name Updated! ")
                    await foundUser[0].save()
        })
    }

    await User.find({_id: req.user._id}, async function(err, foundUser){
        res.render("profile.ejs", { user:foundUser[0], msg: msg, log: true} )
    })
})

app.get("/courses", function(req, res){
    if(req.isAuthenticated()){
        res.render("courses.ejs", {log : true} )
    }
    else{
        res.redirect("/login")
    }
})

app.get("/l1", function(req, res){
    if(req.isAuthenticated()){
        res.render("l1.ejs", {log : true} )
    }
    else{
        res.redirect("/login")
    }
})
app.get("/l2", function(req, res){
    if(req.isAuthenticated()){
        res.render("l2.ejs", {log : true} )
    }
    else{
        res.redirect("/login")
    }
})
app.get("/l3", function(req, res){
    if(req.isAuthenticated()){
        res.render("l3.ejs", {log : true} )
    }
    else{
        res.redirect("/login")
    }
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});