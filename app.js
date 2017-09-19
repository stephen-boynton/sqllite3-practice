const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const mustacheExpress = require("mustache-express");
const fs = require("fs");
const { getCaseId, createCase, createFile } = require("./dal");
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
	res.render("index");
});

app.post("/case", async (req, res) => {
	const oldId = await getCaseId();
	createCase(req.body, oldId);
	res.redirect("/file");
});

app.get("/file", (req, res) => {
	res.render("file");
});

app.post("/file", async (req, res) => {
	const oldId = await getFileId();
	const caseId = await getCaseId();
	let newId = oldId + 1;
	if (!oldId) newId = 1;
	createFile(req.body, newId, caseId);
	res.render("file");
});

app.set("port", 3000);

app.listen(app.get("port"), () => {
	console.log("Your app has started, sir.");
});
