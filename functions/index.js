const functions = require("firebase-functions");

exports.upload = functions.https.onRequest((request, response) => {
	functions.logger.info("Hello logs!", { structuredData: true });
	response.send("Upload Triggered!");
});
