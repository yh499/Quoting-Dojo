// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quote_db');

mongoose.Promise = global.Promise;

var UserSchema = new mongoose.Schema({
 name: {type: String, required: true, minlength:1},
 quote: { type: String, required: true, minlength:5 }
 }, {timestamps: true });

mongoose.model('User', UserSchema); // We are setting this Schema in our Models as 'User'
var User = mongoose.model('User') // We are retrieving this Schema from our Models, named 'User'

console.log("Connected to basic_mongoose");
//var users = [];
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, '/static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, '/views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes


// Root Request===============================================
app.get('/', function(req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    res.render('index', {title: "Hiii"});
})
// Add User Request 
// app.post('/users', function(req, res) {
    
//     console.log("POST DATA", req.body);
//     var user = {};
//     user["name"]= req.body.name;
//     user["age"]= req.body.age;
//     // This is where we would add the user from req.body to the database.
//     Users.push(user);
//     res.redirect('/users');
// })

app.post('/quote', function(req, res) {
  console.log("POST DATA", req.body);
  // create a new User with the name and age corresponding to those from req.body
  var user = new User({name: req.body.name, quote: req.body.quote, createdAt: req.body.createdAt });
  // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
  user.save(function(err) {
    // if there is an error console.log that something went wrong!
    if(err) {
      console.log('something went wrong');
      res.render('index', {errors: user.errors})
    } else { // else console.log that we did well and then redirect to the root route
      console.log('successfully added a user!');
      res.redirect('/quote');
    }
  })
})


app.get('/quote', function (req, res){
    User.find({}, function(err,result){
        res.render('quote', {users: result});
        console.log(result);
    });
})

// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})

