const functions = require("firebase-functions");
const constants = require("./constants");

const cors = require("cors")({ origin: true });

exports.upload = functions.https.onRequest((request, response) => {
	cors(request, response, () => {
		if (constants.allowedServers.includes(request.hostname)) {
			functions.logger.info("Hello logs!", { structuredData: true });
			console.log(request.hostname);
			response.send("Upload Triggered! by " + request.hostname);
		}
	});
});
