//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const app = express();

let reviews=[];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
	res.render("home");
});


app.post("/", function(req, res){
	console.log(req.body);
  const post = {Pname: req.body.Name, Pemail: req.body.Email,Pphone: req.body.Phone, Preview: req.body.Message };
  if(post.Pname != '' && post.Preview !='')
  reviews.push(post);
  res.redirect("review");
});

app.get("/review", function(req, res){
	//console.log(reviews);
	res.render("review", {reviews:reviews});
});

app.get("/admin", function(req, res){
	//console.log(reviews);
	res.render("admin");
});

/* upload section */
const multer = require("multer");

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const storage = multer.diskStorage({
  destination: "./public/assets/img/portfolio/thumbnails",
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
  filename: function(req, file, cb){
  	cb(null, file.fieldname+'-'+Date.now()+path.extname(file.originalname).toLowerCase());
  	}
});

const upload = multer({
	storage: storage,
	limits:{fileSize: 2000048},
	fileFilter: function(req, file, cb){
		checkFileType(file, cb)
		}
}).single('img');

//check file type
function checkFileType(file, cb)
{
			//Allowed Extension
			const filetypes = /jpeg|jpg|png|gif/;
			//check extension
			const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
			//check mime type
			const mimetype = filetypes.test(file.mimetype);

			if(mimetype && extname){
				return cb(null, true);
			}
			else
			{
				cb("Error: Images only!");
			}
}


app.post("/admin", function(req, res){
	upload(req, res, (err) =>{
		if(err){
		res.render("admin",{
			msg: err
		});
	}
	else
	{
		if(req.file == undefined){
			res.render("admin", {
				msg: "Error: No File Selected"
			});
		}
		else{
			res.render("home", {
				msg: "File Uploaded",
				image: `assets/img/portfolio/thumbnails/${req.file.filename}`
			});
		}
	}
	});
})


app.listen(process.env.PORT || 3000, function () {
	// body...
	console.log("Server is running on the port 3000");
});
