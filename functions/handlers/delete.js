const constants = require("../utils/constants");
const functions = require("firebase-functions");
const utilities = require("../utils/utilities");

// Global variables
let httpRequest = undefined;
let httpResponse = undefined;
let admin = undefined;
let db = undefined;
let key = undefined;

// Constants
const DB_NAME = "files";
const FOLDER_NAME = "public";

exports.handler = async (aRequest, aResponse, anAdmin) => {
	/**
	 * VERY IMPORTANT step here. All global variables are INJECTED here and ONLY here
	 */
	httpRequest = aRequest;
	httpResponse = aResponse;
	key = httpRequest.query.key;
	admin = anAdmin;
	db = admin.database();

	functions.logger.info("Entering delete function", { "httpRequest.hostname": httpRequest.hostname });

	if (serverAllowed(httpRequest.hostname)) {
		if (key) {
			// The URL-encoding of the key gets auto-decoded when it passes through HTTP. So we need to explicitly encode it back
			key = encodeURIComponent(key);
			try {
				const successMessageDb = await deleteFromDb();
				const successMessageStorage = await deleteFromStorage();
				const successMessage = { successMessageDb, successMessageStorage };
				httpResponse.json(successMessage);
			} catch (err) {
				const failureMessage = "An error occured while trying to delete key " + key + " Error: " + err;
				functions.logger.error(failureMessage);
				httpResponse.status(500).json(failureMessage);
			}
		} else {
			const failureMessage = { error: "key param missing in the URL" };
			functions.logger.error(failureMessage);
			httpResponse.status(403).json(failureMessage);
		}
	} else {
		const failureMessage = "Access Forbidden to " + httpRequest.hostname;
		functions.logger.error(failureMessage);
		httpResponse.status(403).json(failureMessage);
	}
};

const deleteFromDb = () => {
	return new Promise((resolve, reject) => {
		db.ref(DB_NAME)
			.child(key)
			.remove()
			.then(() => {
				const successMessage = key + " deleted";
				functions.logger.info(successMessage);
				resolve(successMessage);
			})
			.catch((err) => {
				const failureMessage = "An error occured while trying to delete key " + key + ". Error: " + err;
				functions.logger.error(failureMessage);
				reject(failureMessage);
			});
	});
};

const deleteFromStorage = () => {
	const fileUrl = utilities.unHash(key);
	const fileName = utilities.getFileName(fileUrl);
	const bucket = admin.storage().bucket();
	const file = bucket.file(FOLDER_NAME + "/" + fileName);
	return new Promise((resolve, reject) => {
		file.delete({ ignoreNotFound: true })
			.then(() => {
				const successMessage = fileName + " deleted from storage";
				functions.logger.info(successMessage);
				resolve(successMessage);
			})
			.catch(() => {
				const failureMessage = "An error occured while trying to delete file " + fileName + "from storage. Error: " + err;
				functions.logger.error(failureMessage);
				reject(failureMessage);
			});
	});
};

const serverAllowed = (serverHostName) => {
	return constants.allowedServers.includes(serverHostName);
};
