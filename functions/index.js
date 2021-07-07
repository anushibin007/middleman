const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const cors = require("cors")({ origin: true });
const db = admin.database();

const uploadFunction = require("./handlers/upload");

exports.upload = functions.https.onRequest((request, response) => {
	cors(request, response, () => {
		uploadFunction.handler(request, response, db, admin);
	});
});
