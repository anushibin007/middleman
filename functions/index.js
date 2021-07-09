const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const cors = require("cors")({ origin: true });
const speedTest = require("speedtest-net");
const adminDb = admin.database();

const uploadFunction = require("./handlers/upload");
const getExistingFilesFunction = require("./handlers/getexisting");

exports.upload = functions.https.onRequest(async (request, response) => {
	cors(request, response, async () => {
		uploadFunction.handler(request, response, admin);
		return true;
	});
});

exports.getexisting = functions.https.onRequest(async (request, response) => {
	cors(request, response, async () => {
		getExistingFilesFunction.handler(request, response, adminDb);
		return true;
	});
});

exports.getSpeed = functions.https.onRequest(async (request, response) => {
	cors(request, response, async () => {
		try {
			speedTest({ acceptLicense: true }).then((speed) => {
				console.log({ speed });
			});
			response.send("Check the server logs to see the speed");
		} catch (err) {
			response.status(500).send({ err });
		}
	});
});
