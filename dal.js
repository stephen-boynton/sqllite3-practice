const sqlite3 = require("sqlite3").verbose();
const moment = require("moment");
const thisMoment = moment().format();
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

function updateCaseId() {
	const sql = `SELECT case_id FROM Cases LIMIT 1 ORDER BY case_id DESC`;
	db.get(sql, [], (err, row) => {
		if (err) console.log(err);
		console.log(row);
	});
}

function createCase(caseStuff) {
	const caseinfo = `INSERT INTO Cases(case_id, case_name, case_description, date_created, date_modified) VALUES (${caseId}, "${caseStuff.caseName}", "${caseStuff.caseDescription}", ${thisMoment}, ${thisMoment});`;
	console.log(caseinfo);
	db.run(caseinfo, function(err) {
		if (err) {
			return console.error(err.message);
		}
		console.log(`Rows inserted ${this.changes}`);
		db.close();
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
	updateCaseId,
	createCase
};
