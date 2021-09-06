require("dotenv").config();

const express = require("express");
const { json, urlencoded } = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const { UserRoutes } = require("./routes");

const app = express();

app.use(express.static("public"))

var requestTime = function (req, res, next) {

  req.requestTime = Date.now()
  next()
  }

app.use(requestTime)

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

// disable powered by cookies
app.disable("x-powered-by");

app.get("/", function(req, res){
    res.render("home.ejs")
})

app.use("/", UserRoutes); 

const PORT = process.env.PORT || 8000;
const mongoDB = process.env.MONGO_URI;

mongoose.set("useFindAndModify", false); 
mongoose.set("useCreateIndex", true);
mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err.message));
