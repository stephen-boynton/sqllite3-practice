const sqlite3 = require("sqlite3").verbose();
const moment = require("moment");
// open database in memory
const db = new sqlite3.Database(
	__dirname + "/db/test.db",
	sqlite3.OPEN_READWRITE,
	err => {
		if (err) {
			console.error(err.message);
		}
		console.log("Connected to the chinook database.");
	}
);

function getAllCaseInfo() {
	return new Promise((resolve, reject) => {
		const sql = `SELECT * FROM Cases`;
		db.all(sql, [], (err, row) => {
			if (err) console.log(err);
			resolve(row);
		});
	});
}

function getAllFileInfo(caseId) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT * FROM Files WHERE case_id = ${caseId}`;
		db.all(sql, [], (err, row) => {
			if (err) console.log(err);
			resolve(row);
		});
	});
}

function getCaseId(fileName) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT case_id FROM Files WHERE file_name = ${fileName} `;
		db.get(sql, [], (err, row) => {
			if (err) console.log(err);
			resolve(row.case_id);
		});
	});
}

function getLastFileId() {
	return new Promise((resolve, reject) => {
		const sql = `SELECT file_id FROM Files ORDER BY file_id DESC LIMIT 1 `;
		db.get(sql, [], (err, row) => {
			if (err) console.log(err);
			resolve(row.file_id);
		});
	});
}

function getLastTagId() {
	return new Promise((resolve, reject) => {
		const sql = `SELECT tag_id FROM Tags ORDER BY tag_id DESC LIMIT 1 `;
		db.get(sql, [], (err, row) => {
			if (err) console.log(err);
			console.log(row);
			if (row === undefined) {
				resolve(1);
			} else {
				resolve(row.tag_id);
			}
		});
	});
}

function updateCaseId() {
	return new Promise((resolve, reject) => {
		const sql = `SELECT case_id FROM Cases ORDER BY case_id DESC LIMIT 1 `;
		db.get(sql, [], (err, row) => {
			if (err) console.log(err);
			resolve(row.case_id + 1);
		});
	});
}

function updateFileId() {
	return new Promise((resolve, reject) => {
		const sql = `SELECT file_id FROM Files ORDER BY file_id DESC LIMIT 1 `;
		db.get(sql, [], (err, row) => {
			if (err) console.log(err);
			resolve(row.file_id + 1);
		});
	});
}

function createCase(caseStuff, caseId) {
	const now = moment().format("YYYY-MM-DD HH:mm:ss");
	const caseinfo = `INSERT INTO Cases(case_id, case_name, case_description, date_modified)
  VALUES (${caseId}, "${caseStuff.caseName}", "${caseStuff.caseDescription}", '${now}')`;
	console.log(caseinfo);
	db.run(caseinfo, function(err) {
		if (err) {
			return console.error(err.message);
		}
		console.log(`Rows inserted ${this.changes}`);
	});
}

function createFile(fileStuff, fileId, caseId) {
	return new Promise((resolve, reject) => {
		const now = moment().format("YYYY-MM-DD HH:mm:ss");
		const fileInfo = `INSERT INTO Files(file_id, case_id, file_name, file_description, date_modified)
    VALUES (${fileId}, ${caseId}, "${fileStuff.fileName}", "${fileStuff.fileDescription}", '${now}')`;
		console.log(fileInfo);
		db.run(fileInfo, function(err) {
			if (err) {
				return console.error(err.message);
			}
			console.log(`Rows inserted ${this.changes}`);
			resolve("file added");
		});
	});
}

// function createTags(tags, tagId, fileId, caseId) {
// 	const now = moment().format("YYYY-MM-DD HH:mm:ss");
// 	const tagArray = tags.split(", ");
// 	console.log("This is tagArray " + tagArray);
// 	let tagSQL = `INSERT INTO Tags(tag_id, file_id, case_id, tag, date_modified) VALUES`;
// 	tagArray.forEach(tag => {
// 		tagSQL += ` (${tagId}, ${fileId}, ${caseId}, '${tag}', '${now}'),`;
// 	});
// 	tagSQL += ";";
// 	tagSQL = tagSQL.slice(tagSQL.length - 2, 1);
// 	console.log(tagSQL);
// 	db.run(tagSQL, [], err => {
// 		if (err) console.log(err);
// 		console.log(`Rows inserted ${this.changes}`);
// 	});
// }

function createTags(tags, tagId, fileId, caseId) {
	const now = moment().format("YYYY-MM-DD HH:mm:ss");
	const tagArray = tags.split(", ");
	db.serialize(() => {
		// const tagSQL = db.prepare(
		// 	`INSERT INTO Tags(tag_id, file_id, case_id, tag, date_modified) VALUES `
		// );
		tagArray.forEach(tag => {
			const tagging = `INSERT INTO Tags(tag_id, file_id, case_id, tag, date_modified) VALUES (${tagId}, ${fileId}, ${caseId}, '${tag}', '${now}');`;
			console.log(tagging);
			db.run(tagging);
			tagId += 1;
		});
	});
}

// close the database connection

// db.close(err => {
// 	if (err) {
// 		console.error(err.message);
// 	}
// 	console.log("Close the database connection.");
// });

module.exports = {
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
};
