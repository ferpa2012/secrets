//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://ferpa:3317nhy6Ferpa@cluster0.otvw1.mongodb.net/userDB?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Successfully connected to MongoDB!");
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});



userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);




app.get("/", (req,res) => {
  res.render("home");
});

app.route("/login")
.get((req,res) => {
  res.render("login");
})
.post((req,res) => {
  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({email: userName}, (err, foundUser) => {
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  })

});

app.route("/register")
.get((req,res) => {
  res.render("register");
})
.post((req,res) => {
  const newUser = new User ({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save((err) => {
    if(err){
      console.log(err);
    }
    else{
      res.render("secrets");
    }
  })

});





let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000");
});
