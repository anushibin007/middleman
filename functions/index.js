const functions = require("firebase-functions");
const constants = require("./constants");

const cors = require("cors")({ origin: true });

exports.upload = functions.https.onRequest((request, response) => {
	cors(request, response, () => {
		if (serverAllowed(request.hostname)) {
			functions.logger.info("Executing upload function", { "request.hostname": request.hostname });
			response.send("Upload Triggered! by " + request.hostname);
		} else {
			functions.logger.error("Access Forbidden", { "request.hostname": request.hostname });
			response.status(403).json({ error: "Access Forbidden" });
		}
	});
});

const serverAllowed = (serverHostName) => {
	return constants.allowedServers.includes(serverHostName);
};
