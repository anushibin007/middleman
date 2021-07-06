const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const constants = require("./constants");
const path = require("path");
const os = require("os");
const fs = require("fs");
const wget = require("wget-improved");

const cors = require("cors")({ origin: true });
const db = admin.database();

exports.upload = functions.https.onRequest((request, response) => {
	cors(request, response, async () => {
		functions.logger.info("Executing upload function", { "request.hostname": request.hostname });
		if (serverAllowed(request.hostname)) {
			const fileUrl = request.query.fileUrl;
			if (fileUrl) {
				const fileName = path.basename(fileUrl);
				const target = os.tmpdir() + "/" + path.basename(fileName);
				// wget the file locally
				await wgetTheFile(fileUrl, target)
					//.then((resolve) => response.json(resolve))
					.catch((reject) => {
						response.status(500).json(reject);
					});
				// upload the file to Storage
				await uploadFileToStorage(target, fileName)
					.then((resolve) => response.json(resolve))
					.catch((reject) => {
						response.status(500).json(reject);
					});
				// Add an entry to DB
			} else {
				functions.logger.error("fileUrl missing");
				response.status(400).json({ error: "fileUrl missing" });
			}
		} else {
			functions.logger.error("Access Forbidden", { "request.hostname": request.hostname });
			response.status(403).json({ error: "Access Forbidden" });
		}
	});
});

const wgetTheFile = (fileUrl, target) => {
	let download = wget.download(fileUrl, target);
	return new Promise((resolve, reject) => {
		download.on("end", (output) => {
			console.log({ output });
			resolve({ success: output });
		});
		download.on("error", (err) => {
			console.log({ err });
			reject({ error: "Could not download file due to : " + err });
		});
		download.on("start", (fileSize) => {
			console.log({ fileSize });
		});
	});
};

const uploadFileToStorage = (target, fileName) => {
	return new Promise(async (resolve, reject) => {
		try {
			const bucket = admin.storage().bucket("middleman-bucket");
			await bucket.upload(target, { destination: fileName });
			const successMessage = { success: "File '" + fileName + "' written to Storage" };
			console.log(successMessage);
			resolve(successMessage);
		} catch (err) {
			reject({ err: err });
		}
	});
};

const serverAllowed = (serverHostName) => {
	return constants.allowedServers.includes(serverHostName);
};
