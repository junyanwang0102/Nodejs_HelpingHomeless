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

var UserVolunteer = mongoose.model("UserVolunteer", uservolunteerSchema);
var VolNgo = mongoose.model("VolNgo", volNgoSchema);

// ************** Start Restful Routing ****************
// Home Page
app.get('/',(req,res) => {
	res.render("index");
});

// Data Visulization Page
app.get('/homelessdv',(req,res) => {
	res.render("dv");
});

// volunteer page
app.get('/volunteers', (req,res) => {
	var location = req.query.location;
	var description = req.query.description;
	if (typeof location !== "undefined") {
		var suburb_str = location.split(",");
		var suburb_name = suburb_str[0];
		if (description === 'children') {
			VolNgo.find({$and:[{suburb: suburb_name}, {children: 'y'}]}, (err, volNGOs) => {
				if (err) {
					console.log(err);
				} else {
					//console.log(volNGOs);
					res.render("volunteer", {volNGO: volNGOs});
				}
			});
		} else if (description === 'adult') {
			VolNgo.find({$and:[{suburb: suburb_name}, {adult: 'y'}]}, (err, volNGOs) => {
				if (err) {
					console.log(err);
				} else {
					res.render("volunteer", {volNGO: volNGOs});
				}
			});
		} else if (description === 'old') {
			VolNgo.find({$and:[{suburb: suburb_name}, {old: 'y'}]}, (err, volNGOs) => {
				if (err) {
					console.log(err);
				} else {
					res.render("volunteer", {volNGO: volNGOs});
				}
			});
		} else if (description === 'family') {
			VolNgo.find({$and:[{suburb: suburb_name}, {family: 'y'}]}, (err, volNGOs) => {
				if (err) {
					console.log(err);
				} else {
					res.render("volunteer", {volNGO: volNGOs});
				}
			});
		} else {
			VolNgo.find({suburb: suburb_name}, (err, volNGOs) => {
				if (err) {
					console.log(err);
				} else {
					res.render("volunteer", {volNGO: volNGOs});
				}
			});
		}
	} else {
		// 第一次访问volunteer page的时候给一个数据库中没有的suburb然后什么也不显示
		VolNgo.find({suburb: "shanghai"}, (err, volNGOs) => {
			if (err) {
				console.log(err);
			} else {
				res.render("volunteer", {volNGO: volNGOs});
			}
		});
	}
});












// mongoDB 排序组合！
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

// 第一步，用户在volunteer page 填写完subrub和type的时候，处理表单的信息
// app.post("/volunteers", function(req, res){
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

	  
// 	// 接收表单信息后创建一个新对象并且存到数据库里
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