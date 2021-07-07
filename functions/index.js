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
const DB_NAME = "files";

exports.upload = functions.https.onRequest((request, response) => {
	cors(request, response, async () => {
		functions.logger.info("Executing upload function", { "request.hostname": request.hostname });
		if (serverAllowed(request.hostname)) {
			const fileUrl = request.query.fileUrl;
			if (fileUrl) {
				const fileName = path.basename(fileUrl);
				const target = os.tmpdir() + "/" + path.basename(fileName);
				// Check if the file already exists
				await checkIfFileExists(fileName)
					.then((resolve) => response.json(resolve))
					.catch(async () => {
						// File is not present in the DB. Fetch it

						// wget the file locally
						await wgetTheFile(fileUrl, target)
							//.then((resolve) => response.json(resolve))
							.catch((reject) => {
								response.status(500).json(reject);
							});
						// upload the file to Storage
						await uploadFileToStorage(target, fileName)
							//.then((resolve) => response.json(resolve))
							.catch((reject) => {
								response.status(500).json(reject);
							});
						// Add an entry to DB
						await addEntryToDB(fileUrl, fileName)
							.then((resolve) => response.json(resolve))
							.catch((reject) => {
								response.status(500).json(reject);
							});
						// Delete the file from local
						await deleteLocalFile(target)
							//.then((resolve) => response.json(resolve))
							.catch((reject) => {
								// ignore the error
							});
					});
			} else {
				const failureMessage = { error: "fileUrl missing" };
				functions.logger.error(failureMessage);
				response.status(400).json(failureMessage);
			}
		} else {
			const failureMessage = { error: "Access Forbidden to " + request.hostname };
			functions.logger.error(failureMessage);
			response.status(403).json(failureMessage);
		}
	});
});

const checkIfFileExists = (fileName) => {
	const fileNameHash = getHash(fileName);
	return new Promise((resolve, reject) => {
		db.ref(DB_NAME)
			.child(fileNameHash)
			.get()
			.then((doc) => {
				if (doc.exists()) {
					const documentValue = doc.val();
					functions.logger.info("File '" + fileName + "' already exists in storage", documentValue);
					resolve(documentValue);
				} else {
					reject("File '" + fileName + "' does not exist in storage");
				}
			})
			.catch((err) => {
				reject({ err: err });
			});
	});
};

const wgetTheFile = (fileUrl, target) => {
	let download = wget.download(fileUrl, target);
	return new Promise((resolve, reject) => {
		download.on("end", (output) => {
			functions.logger.info({ output });
			resolve({ success: output });
		});
		download.on("error", (err) => {
			functions.logger.error({ err });
			reject({ error: "Could not download file due to : " + err });
		});
		download.on("start", (fileSize) => {
			functions.logger.info({ fileSize });
		});
	});
};

const uploadFileToStorage = (target, fileName) => {
	return new Promise(async (resolve, reject) => {
		try {
			const bucket = admin.storage().bucket();
			await bucket.upload(target, { destination: fileName });
			const successMessage = { success: "File '" + fileName + "' written to Storage" };
			functions.logger.info(successMessage);
			resolve(successMessage);
		} catch (err) {
			functions.logger.error({ err });
			reject({ err: err });
		}
	});
};

const addEntryToDB = (fileUrl, fileName) => {
	const fileUrlHash = getHash(fileUrl);
	const dataToWriteToDb = {
		fileName: fileName,
		fileUrl: fileUrl,
		createdAt: new Date().getTime(),
	};
	return new Promise(async (resolve, reject) => {
		db.ref(DB_NAME + "/" + fileUrlHash)
			.set(dataToWriteToDb)
			.then(() => {
				functions.logger.info(dataToWriteToDb);
				resolve(dataToWriteToDb);
			})
			.catch((err) => {
				functions.logger.error({ err: err });
				reject({ err: err });
			});
	});
};

const deleteLocalFile = (target) => {
	return new Promise((resolve, reject) => {
		fs.unlink(target, (err) => {
			if (err) {
				const failureMessage = { error: "File '" + target + "' could not be deleted. Error: " + err };
				functions.logger.error(failureMessage);
				reject(failureMessage);
			}
			const successMessage = { success: "File '" + target + "' deleted from filesystem" };
			functions.logger.info(successMessage);
			resolve(successMessage);
		});
	});
};

const serverAllowed = (serverHostName) => {
	return constants.allowedServers.includes(serverHostName);
};

const getHash = (input) => {
	return Buffer.from(input).toString("base64");
};
