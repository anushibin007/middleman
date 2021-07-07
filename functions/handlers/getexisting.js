const constants = require("../utils/constants");
const functions = require("firebase-functions");
const path = require("path");
const os = require("os");
const fs = require("fs");
const wget = require("wget-improved");

const DB_NAME = "files";

exports.handler = async (request, response, db) => {
	functions.logger.info("Entering upload function", { "request.hostname": request.hostname });
	if (serverAllowed(request.hostname)) {
		await getExistingFiles(response, db);
	} else {
		const failureMessage = { error: "Access Forbidden to " + request.hostname };
		functions.logger.error(failureMessage);
		response.status(403).json(failureMessage);
	}
};

const getExistingFiles = (response, db) => {
	return new Promise((resolve) => {
		db.ref(DB_NAME)
			.get()
			.then((doc) => {
				const documentValue = doc.val();
				response.json({ docs: documentValue });
				resolve({ docs: documentValue });
			})
			.catch((err) => {
				functions.logger.error({ error: "An error occured while looking for documents. Error: " + err });
				response.status(500).json({ error: err });
				resolve({ docs: null });
			});
	});
};

const serverAllowed = (serverHostName) => {
	return constants.allowedServers.includes(serverHostName);
};

const getHash = (input) => {
	return Buffer.from(input).toString("base64");
};
