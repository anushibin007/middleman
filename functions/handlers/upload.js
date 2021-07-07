const constants = require("../utils/constants");
const functions = require("firebase-functions");
const path = require("path");
const os = require("os");
const fs = require("fs");
const wget = require("wget-improved");

const DB_NAME = "files";

exports.handler = async (request, response, db, admin) => {
	functions.logger.info("Entering upload function", { "request.hostname": request.hostname });
	if (serverAllowed(request.hostname)) {
		const fileUrl = request.query.fileUrl;
		if (fileUrl) {
			const fileName = path.basename(fileUrl);
			const target = os.tmpdir() + "/" + path.basename(fileName);
			// Check if the file already exists
			let fileExists = await checkIfFileExists(db, fileUrl);

			// If the file is not present in the DB. Fetch it
			if (!fileExists) {
				try {
					// wget the file locally
					await wgetTheFile(response, fileUrl, target);
					// upload the file to Storage
					await uploadFileToStorage(response, admin, target, fileName);
					// Add an entry to DB
					await addEntryToDB(response, db, fileUrl, fileName);
					// Delete the file from local
					deleteLocalFile(target);
					response.json({ success: fileUrl + " uploaded successfully" });
				} catch (err) {
					// ignore the error because we are handling it in individual methods
				}
			} else {
				response.json({ success: fileUrl + " already exists" });
			}
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
};

const checkIfFileExists = (db, fileUrl) => {
	const fileUrlHash = getHash(fileUrl);
	return new Promise((resolve) => {
		db.ref(DB_NAME)
			.child(fileUrlHash)
			.get()
			.then((doc) => {
				if (doc.exists()) {
					const documentValue = doc.val();
					functions.logger.info("File '" + fileUrl + "' already exists in storage", documentValue);
					resolve(true);
				} else {
					functions.logger.info("File '" + fileUrl + "' does not exist in storage");
					resolve(false);
				}
			})
			.catch((err) => {
				functions.logger.error({ error: "An error occured while checking if '" + fileUrl + "'exists in storage. Error: " + err });
				resolve(false);
			});
	});
};

const wgetTheFile = (response, fileUrl, target) => {
	let download = wget.download(fileUrl, target);
	return new Promise((resolve, reject) => {
		download.on("end", (output) => {
			functions.logger.info({ output });
			resolve({ success: output });
		});
		download.on("error", (err) => {
			functions.logger.error({ err });
			response.status(500).json({ error: "Could not download file due to : " + err });
			reject({ error: "Could not download file due to : " + err });
		});
		download.on("start", (fileSize) => {
			functions.logger.info({ fileSize });
		});
	});
};

const uploadFileToStorage = (response, admin, target, fileName) => {
	return new Promise(async (resolve, reject) => {
		try {
			const bucket = admin.storage().bucket();
			await bucket.upload(target, { destination: fileName });
			const successMessage = { success: "File '" + fileName + "' written to Storage" };
			functions.logger.info(successMessage);
			resolve(successMessage);
		} catch (err) {
			const failureMessage = { err: err, message: "Cannot upload file to Storage" };
			functions.logger.error(failureMessage);
			response.status(500).json(failureMessage);
			reject(failureMessage);
		}
	});
};

const addEntryToDB = (response, db, fileUrl, fileName) => {
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
				response.status(500).json({ err: err });
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
