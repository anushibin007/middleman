const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const cors = require("cors")({ origin: true });
const adminDb = admin.database();

const uploadFunction = require("./handlers/upload");
const deletedoc = require("./handlers/delete");
const getExistingFilesFunction = require("./handlers/getexisting");

const token = "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm";
const FastSpeedtest = require("fast-speedtest-api");

exports.upload = functions.https.onRequest(async (request, response) => {
	cors(request, response, async () => {
		uploadFunction.handler(request, response, admin);
		return true;
	});
});

exports.delete = functions.https.onRequest(async (request, response) => {
	cors(request, response, async () => {
		deletedoc.handler(request, response, admin);
		return true;
	});
});

exports.getexisting = functions.https.onRequest(async (request, response) => {
	cors(request, response, async () => {
		getExistingFilesFunction.handler(request, response, adminDb);
		return true;
	});
});

exports.getspeed = functions.https.onRequest((request, response) => {
	cors(request, response, () => {
		let speedtest = new FastSpeedtest({
			token: token, // required
			verbose: false, // default: false
			timeout: 10000, // default: 5000
			https: true, // default: true
			urlCount: 5, // default: 5
			bufferSize: 8, // default: 8
			unit: FastSpeedtest.UNITS.Mbps, // default: Bps
		});
		speedtest
			.getSpeed()
			.then((s) => {
				console.log(`Speed: ${s} Mbps`);
			})
			.catch((e) => {
				console.error("Couldn't get speed: " + e.message);
			});
		response.send({ status: "Speed logged in the server log" });
	});
});
