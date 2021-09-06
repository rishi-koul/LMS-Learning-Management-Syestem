const { Router } = require("express");
const { UserController } = require("../controllers");
var multer = require('multer');

const router = Router();

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '././public/images')
    },
    filename: (req, file, cb) => {
        const name = file.originalname.replace(" ", "-") 
        cb(null, Date.now() + "-" + name)
    }
  });
  
var upload = multer({ storage: storage });

router.get("/login", function(req, res){
    res.render("login.ejs")
})
router.post("/login/", UserController.login);

router.get("/signup", function(req, res){
    res.render("signup.ejs")
})
router.post("/signup", upload.single('image'), UserController.signup);
router.get("/profile", UserController.profile);

router.get("/logout/:username", UserController.logout);

module.exports = router;
