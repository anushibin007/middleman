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
					// Add an entry to DB
					await setFileProgress(response, db, fileUrl, 0);
					// wget the file locally
					wgetTheFile(response, fileUrl, target, db).then(async () => {
						// upload the file to Storage
						await uploadFileToStorage(response, admin, target, fileName, db, fileUrl);
						// Delete the file from local
						deleteLocalFile(target);
					});
					response.json({ success: fileUrl + " scheduled successfully. Refresh to see progress." });
				} catch (err) {
					// ignore the error because we are handling it in individual methods
				}
			} else {
				response.json({ success: fileUrl + " already exists", data: fileExists });
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
				if (doc.exists() && doc.val().progress != -1) {
					const documentValue = doc.val();
					functions.logger.info("File '" + fileUrl + "' already exists in storage", documentValue);
					resolve(documentValue);
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

const wgetTheFile = (response, fileUrl, target, db) => {
	let download = wget.download(fileUrl, target);
	let progressChunks = [0, 25, 50, 100];
	return new Promise((resolve, reject) => {
		download.on("end", (output) => {
			functions.logger.info({ output });
			resolve({ success: output });
		});
		download.on("error", (err) => {
			functions.logger.error({ err });
			response.status(500).json({ error: "Could not download file due to : " + err });
			setFileProgress(response, db, fileUrl, -1);
			reject({ error: "Could not download file due to : " + err });
		});
		download.on("start", (fileSize) => {
			functions.logger.info({ fileSize });
		});
		download.on("progress", async (progress) => {
			// store the progress to the DB only once every 0, 25, 50 & 100%
			const progressPercentage = parseInt(progress * 100);
			if (progressChunks.includes(progressPercentage)) {
				setFileProgress(response, db, fileUrl, progressPercentage);
				// we have reached x percent and stored it into DB once. So we need not do it again. So store remove that percent from the array
				progressChunks = progressChunks.filter((e) => e != progressPercentage);
			}
		});
	});
};

const uploadFileToStorage = (response, admin, target, fileName, db, fileUrl) => {
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
			setFileProgress(response, db, fileUrl, -1);
			reject(failureMessage);
		}
	});
};

const setFileProgress = (response, db, fileUrl, progress) => {
	const fileUrlHash = getHash(fileUrl);
	const fileName = path.basename(fileUrl);
	const dataToWriteToDb = {
		fileName: fileName,
		fileUrl: fileUrl,
		createdAt: new Date().getTime(),
		progress: progress,
	};
	return new Promise(async (resolve, reject) => {
		db.ref(DB_NAME + "/" + fileUrlHash)
			.update(dataToWriteToDb)
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
