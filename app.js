const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const mustacheExpress = require("mustache-express");
const fs = require("fs");
const { updateCaseId, updateFileId, createCase, createFile } = require("./dal");
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
	const caseId = await updateCaseId();
	createCase(req.body, caseId);
	res.redirect("/file");
});

app.get("/file", (req, res) => {
	res.render("file");
});

app.post("/file", async (req, res) => {
	// let newId = await updateFileId();
	let newId = 1;
	let caseId = 4;
	if (newId === NaN || !newId) newId = 1;
	await createFile(req.body, newId, caseId);
	fileId = await getFileId(req.body.fileName);
	caseId = await getCaseId(req.body.fileName);
	createTags(req.body.tags, fileId, caseId);
	res.redirect("file");
});

app.set("port", 3000);

app.listen(app.get("port"), () => {
	console.log("Your app has started, sir.");
});
