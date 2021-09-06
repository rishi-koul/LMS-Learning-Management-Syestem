const { Router } = require("express");
const { UserController } = require("../controllers");

const router = Router();

router.get("/login", function(req, res){
    res.render("login.ejs")
})
router.post("/login/", UserController.login);

router.get("/signup", function(req, res){
    res.render("signup.ejs")
})
router.post("/signup", UserController.signup);
router.get("/profile", UserController.profile);

module.exports = router;
