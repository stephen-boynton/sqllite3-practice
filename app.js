const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const mustacheExpress = require("mustache-express");
const fs = require("fs");
const {
	getAllCaseInfo,
	getAllFileInfo,
	getCaseId,
	getLastFileId,
	getLastTagId,
	updateCaseId,
	updateFileId,
	createCase,
	createFile,
	createTags
} = require("./dal");
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

app.get("/", async (req, res) => {
	console.log(await getLastTagId());
	const caseInfo = await getAllCaseInfo();
	console.log(caseInfo);
	req.session.cases = caseInfo;
	res.render("index", { cases: req.session.cases });
});

app.post("/case", async (req, res) => {
	const caseId = await updateCaseId();
	createCase(req.body, caseId);
	res.redirect("/file");
});

app.get("/:case", async (req, res) => {
	req.session.currentCase = req.params.case;
	const fileInfo = await getAllFileInfo(req.params.case);
	req.session.files = fileInfo;
	res.render("caseFiles", { files: req.session.files });
});

app.get("/case/file", (req, res) => {
	res.render("file");
});

app.post("/case/file", async (req, res) => {
	const newId = (await getLastFileId()) + 1;
	const caseId = req.session.currentCase;
	await createFile(req.body, newId, caseId);
	const fileId = await getLastFileId();
	console.log(fileId);
	console.log(req.body.tags);
	const tagId = (await getLastTagId()) + 1;
	createTags(req.body.tags, tagId, fileId, caseId);
	res.redirect("file");
});

app.set("port", 3000);

app.listen(app.get("port"), () => {
	console.log("Your app has started, sir.");
});
