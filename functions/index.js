const functions = require("firebase-functions");

const cors = require("cors")({ origin: true });

exports.upload = functions.https.onRequest((request, response) => {
	cors(request, response, () => {
		functions.logger.info("Hello logs!", { structuredData: true });
		response.send("Upload Triggered!");
	});
});
