require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

// cloud DB: MongoDB Atalas
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

var uservolunteerSchema = new mongoose.Schema({
	description: String,
	location: String,
	lat: Number,
	lng: Number
});

var volNgoSchema = new mongoose.Schema({
	name: String,
	main_beneficiaries: String,
	children: String,
	adult: String,
	old: String,
	family: String,
	num_volunteers: Number,
	address: String,
	latitude: Number,
	longitude: Number,
	suburb: String
});

// initialize Schema for donation data
var donationNgoSchema = new mongoose.Schema({
	Name: String,
	What: String,
	Phone: String,
	Website: String,
	Monday: String,
	Tuesday: String,
	Wednesday: String,
	Thursday: String,
	Friday: String,
	Saturday: String,
	Sunday: String,
	Public_holidays: String,
	Address: String,
	Latitude: Number,
	Longitude: Number,
	Suburb: String
});

// build data model for user, volunteer and donation
var UserVolunteer = mongoose.model("UserVolunteer", uservolunteerSchema);
var VolNgo = mongoose.model("VolNgo", volNgoSchema);
var DonationNgo = mongoose.model("donationNgo", donationNgoSchema);

// insert data into DB
// DonationNgo.create();

// delete data
// DonationNgo.remove({}, function(err) {});

// ************** Start Restful Routing ****************
// Home Page
app.get('/',(req,res) => {
	res.render("index");
});

// Data Visulization Page
app.get('/homelessdv',(req,res) => {
	res.render("dv");
});

// Volunteer page
app.get('/volunteers', (req,res) => {                            // get the request from /volunteers page
	var location = req.query.location;                             // get the location within request query
	var description = req.query.description;
	if (typeof location !== "undefined") {                         // if location is exists
		if (description === 'children') {	                           // if the description is children
			VolNgo.find({$and:[{suburb: location}, {children: 'y'}]}, {_id:0}, (err, volNGOs) => {// connect to the data model and find NGOs for children in that suburb
				if (err) {                                               // deal with errs
					console.log(err);
				} else {
					res.render("volunteer", {volNGO: volNGOs});            // if no error, render the response throngh volNGO to the volunteer.ejs file
				}
			});
		} else if (description === 'adult') {
			VolNgo.find({$and:[{suburb: location}, {adult: 'y'}]}, {_id:0}, (err, volNGOs) => {
				if (err) {
					console.log(err);
				} else {
					res.render("volunteer", {volNGO: volNGOs});
				}
			});
		} else if (description === 'old') {
			VolNgo.find({$and:[{suburb: location}, {old: 'y'}]}, {_id:0}, (err, volNGOs) => {
				if (err) {
					console.log(err);
				} else {
					res.render("volunteer", {volNGO: volNGOs});
				}
			});
		} else if (description === 'family') {
			VolNgo.find({$and:[{suburb: location}, {family: 'y'}]}, {_id:0}, (err, volNGOs) => {
				if (err) {
					console.log(err);
				} else {
					res.render("volunteer", {volNGO: volNGOs});
				}
			});
		} else {
			VolNgo.find({suburb: location}, {_id:0}, (err, volNGOs) => {
				if (err) {
					console.log(err);
				} else {
					res.render("volunteer", {volNGO: volNGOs});
				}
			});
		}
	} else {
		VolNgo.find({suburb: "shanghai"}, (err, volNGOs) => {
			if (err) {
				console.log(err);
			} else {
				res.render("volunteer", {volNGO: volNGOs});
			}
		});
	}
});

// Donation page
app.get('/donations', (req,res) => {                    // get request
	var location = req.query.location;
	if (typeof location !== "undefined") {                // if request contains location
		DonationNgo.find({Suburb: location}, {_id:0}, function(err, donationNGOs) {     // find the NGOs in that location, clear the _id autogenerated by mongo
			if (err) {
				console.log(err);
			} else {
				res.render("donation", {donationNGO: donationNGOs});     // no error, render the data model to donation page
			}
		});
	} else {
		DonationNgo.find({suburb: "shanghai"}, function(err, donationNGOs) {
			if (err) {
				console.log(err);
			} else {
				res.render("donation", {donationNGO: donationNGOs});
			}
		});
	}
});

// render doantion infographic
app.get('/donateinfo', (req,res) => {
	res.render("donate_info");
});

app.get('/volinfo', (req,res) => {
	res.render("vol_info");
});












// var mySort = {_id:-1};

// local DB
// mongoose.connect("mongodb://localhost/iedb", {useNewUrlParser: true});

// var volunteerSchema = new mongoose.Schema({
// 	name: String,
// 	postcode: Number,
// 	charity_size: String,
// 	main_activity: String,
// 	main_beneficiaries: String,
// 	Children: String,
// 	Adult: String,
// 	Old: String,
// 	Family: String,
// 	num_volunteers: Number,
// 	net_income: Number,
// 	address: String,
// 	latitude: Number,
// 	longitude: Number
// });


//   var description = req.body.description;
//   geocoder.geocode(req.body.location, function(err, data) {
//     if (err || !data.length) {
//       //req.flash('error', 'Invalid address');
//       return res.redirect('back');
//     }
//     var lat = data[0].latitude;
//     var lng = data[0].longitude;
//     var location = data[0].formattedAddress;  // Carnegie VIC 3163, Australia
//     var newUserVolunteer = {description: description, location: location, lat: lat, lng: lng};

	  
//     UserVolunteer.create(newUserVolunteer, function(err, newlyCreated){
//         if(err){
//             console.log(err);
//         } else {
// 			//res.render("volunteer");
//             res.redirect("/volunteers#map");
//         }
//     });
	  
//   });
// });

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