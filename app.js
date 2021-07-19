//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const ejs = require("ejs");
const app = express();

// app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
	res.sendFile(__dirname+"/index.html");
});




app.listen(process.env.PORT || 3000, function () {
	// body...
	console.log("Server is running on the port 3000");
});
