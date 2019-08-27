var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// set mongoose, localhost/DB's name

// local DB
// mongoose.connect("mongodb://localhost/iedb", {useNewUrlParser: true});

// cloud DB
mongoose.connect('mongodb+srv://andrew:wjyQQ1995227@cluster0-t4pli.mongodb.net/iedb?retryWrites=true&w=majority', {
	useNewUrlParser: true
}).then(() => {
	console.log('Connected to iedb.');
}).catch(err => {
	console.log("EROOR:", err.message);
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// set iedb's Schema
var councilSchema = new mongoose.Schema({
	council: String,
	number_of_homeless: Number
});
var suburbSchema = new mongoose.Schema({
	council: String,
	suburb: String,
	All_homeless_persons: Number
});

// using mongoose to create two model: Council && Suburb
var Council = mongoose.model("Council", councilSchema);
var Suburb = mongoose.model("Suburb", suburbSchema);


// RESTful ROUTE STARTS HERE
app.get('/',(req,res) => {
	res.render("index");
});

// data visualizaiton route
app.get('/homelessdv',(req,res) => {
	res.render("dv");
});
// app.get('/homelessness', (req,res) => {
// 	//Get all homelessness from db
// 	Blog.find({}, (err, homelessness) => {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			res.render("index",{homelessness: homelessness});
// 		}
// 	});
// });

// new route
// app.get('/blogs/new',(req,res) => {
// 	res.render("new");
// });

//create route
// app.post('/blogs', (req,res) => {
// 	//create a new blog and save to DB
// 	Blog.create(req.body.blog, (err,newBlog) => {
// 		if (err) {
// 			res.render("new");
// 		} else {
// 			res.redirect('/blogs');
// 		}
// 	})
// });

// show route
// app.get('/blogs/:id',(req,res) => {
// 	Blog.findById(req.params.id, (err, foundBlog) => {
// 		if (err) {
// 			res.redirect("/blogs");
// 		} else {
// 			res.render("show", {blog: foundBlog});
// 		}
// 	});
// });


app.listen(process.env.PORT || 3000, () => {
	console.log("Supportive Server has started!");
});