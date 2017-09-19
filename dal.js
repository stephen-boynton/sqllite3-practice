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

function getCaseId() {
	return new Promise((resolve, reject) => {
		const sql = `SELECT case_id FROM Cases ORDER BY case_id DESC LIMIT 1 `;
		db.get(sql, [], (err, row) => {
			if (err) console.log(err);
			console.log(row.case_id);
			resolve(row.case_id);
		});
	});
}

function createCase(caseStuff, oldCaseId) {
	const now = moment().format("YYYY-MM-DD HH:mm:ss");
	const caseId = oldCaseId + 1;
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
	const now = moment().format("YYYY-MM-DD HH:mm:ss");
	const fileInfo = `INSERT INTO Files(file_id, case_id, file_name, file_description, date_modified)
  VALUES (${fileId}, ${caseId} "${fileStuff.fileName}", "${fileStuff.fileDescription}", '${now}')`;
	console.log(fileInfo);
	db.run(fileInfo, function(err) {
		if (err) {
			return console.error(err.message);
		}
		console.log(`Rows inserted ${this.changes}`);
	});
}

function createTags(tags) {
	const tagArray = tags.split(", ");
}

// close the database connection

// db.close(err => {
// 	if (err) {
// 		console.error(err.message);
// 	}
// 	console.log("Close the database connection.");
// });

module.exports = {
	getCaseId,
	createCase,
	createFile
};
