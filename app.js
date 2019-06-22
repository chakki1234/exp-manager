var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localstrategy = require("passport-local");
var passportlocalmongoose = require("passport-local-mongoose");
var methodoverride = require("method-override");
var Expense = require("./models/Expense.js");
var User = require("./models/User.js");


mongoose.connect("mongodb://localhost:27017/expensemanager", { useNewUrlParser: true });


/*mongoose.connect("mongodb+srv://chakki1234:Everyone@1234@@cluster0-c2uko.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true
});
*/

app.use(require("express-session")({
    secret: "nothing",
    resave: false,
    saveUninitialized: false
}));

app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended : true }));
app.use(methodoverride("_method"));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



function loggedin(req, res, next){
	if(req.isAuthenticated())
		next();
	else
		res.redirect("/login")
}

app.get("/home", function(req, res){
var title = "Home";
res.render("home.ejs", { title: title });
});

app.get("/login", function(req, res){
var title = "Login"
res.render("loginpg.ejs", { title: title });
});

app.get("/register", function(req, res){
var title = "Register"
res.render("register.ejs",{title: title});
});


app.post("/register", function(req, res){
User.register(new User({ username: req.body.username }), req.body.password, function(err, added){
if(err)
 res.send(err.message);
else
{
  passport.authenticate("local")(req, res, function(err){
  res.redirect("/dashboard");
});
}
});
});

app.post("/login", passport.authenticate("local", {
    successRedirect : "/dashboard",
    failureRedirect : "/login"
}), function(req, res){
});


app.get("/dashboard", loggedin, function(req, res){
User.findOne({ username: req.user.username }, function(err, user){ 
  if(user.balance<0)
  	{
  		user.balance=0;
    	user.save();
    } 
var title = "Dashboard"; 
res.render("dashboard.ejs",{ title: title , user: user});
});
});

app.get("/logout", function(req, res){
req.logout();
var title = "Home";
res.render("home.ejs",{ title: title})
});

app.get("/add", loggedin, function(req, res){
User.findOne({ username: req.user.username }, function(err, user){
var title = "Add";
res.render("add.ejs",{title: title, user: user });
});
});

app.post("/add", function(req, res){


	User.findOne({_id: req.user._id}).populate("expenses").exec(function(err, founduser){
		if(req.body.amount>founduser.balance){
			res.redirect("/errmsg2");
		} else {
		Expense.create(req.body, function(err, addedexpense){
         founduser.expenses.push(addedexpense._id);
         founduser.spent += req.body.amount;
         founduser.balance -= req.body.amount;
         founduser.save();
         res.redirect("/dashboard");
		});
       }
	});
});

app.get("/view", loggedin, function(req, res){
var title = "view";
User.findOne({_id: req.user._id}).populate("expenses").exec(function(err, user){
res.render("view.ejs", {title: title, user: user});
  });
});


app.get("/delete", loggedin, function(req, res){
	var title = "Delete"; 
User.findOne({_id: req.user._id}).populate("expenses").exec(function(err, user){
res.render("delete.ejs",{ title: title , user: user });
});
});

app.post("/delete", function(req, res){
Expense.findOne({title: req.body.title}, function(err, foundexpense){
if(foundexpense==null)
	res.redirect("/errmsg");
else
{
User.findOne({ username: req.user.username }, function(err, user){
user.balance += foundexpense.amount;
user.save();
Expense.remove({title: req.body.title},function(err, removed){
res.redirect("/view");
});	
});
}
});
});

app.post("/dashboard", function(req, res){
User.findOne({ username: req.user.username }, function(err, founduser){
	founduser.moneysp = req.body.moneysp;
	founduser.balance = req.body.moneysp;
	founduser.save();
	res.redirect("/dashboard");
});
});

app.get("/addmoney", function(req, res){
	User.findOne({_id: req.user._id}).populate("expenses").exec(function(err,user){
    for(var i=0; i<user.expenses.length; ++i)
    {
		Expense.remove({ title: String(user.expenses[i].title) }, function(err, removed){
		console.log(removed);
		});
	}
    user.moneysp = undefined;
    user.save();
    res.redirect("/dashboard");
	});
});

app.get("/errmsg", loggedin, function(req, res){
var title = "errmsg"
res.render("errmsg1.ejs",{ title: title });
});

app.get("/errmsg2", loggedin, function(req, res){
var title = "errmsg"
res.render("errmsg2.ejs",{ title: title });
});

app.listen(3000, function(){
console.log("Server started");
});