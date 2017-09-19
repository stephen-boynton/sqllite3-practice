const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const mustacheExpress = require("mustache-express");
const fs = require("fs");
const { updateCaseId, createCase } = require("./dal");
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("public"));
app.use(
	session({
		secret: "hamsandwich",
		saveUninitialized: false,
		resave: false
	})
);

//your routes

app.get("/", (req, res) => {
	updateCaseId();
	res.render("index");
});

app.post("/case", (req, res) => {
	createCase(req.body);
	res.redirect("/");
});

app.set("port", 3000);

app.listen(app.get("port"), () => {
	console.log("Your app has started, sir.");
});
