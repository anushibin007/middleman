const constants = require("../utils/constants");
const functions = require("firebase-functions");
const path = require("path");
const request = require("request");

const DB_NAME = "files";

exports.handler = async (request, response, db, admin) => {
	functions.logger.info("Entering upload function", { "request.hostname": request.hostname });
	if (serverAllowed(request.hostname)) {
		const fileUrl = request.query.fileUrl;
		if (fileUrl) {
			const fileName = path.basename(fileUrl);
			// Check if the file already exists
			let fileExists = await checkIfFileExists(db, fileUrl);

			// If the file is not present in the DB. Fetch it
			if (!fileExists) {
				try {
					// Add an entry to DB
					await setFileProgress(response, db, fileUrl, 0);

					// pipe the remote stream to the Storage
					uploadFileToStorage(response, admin, fileName, db, fileUrl);

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

const uploadFileToStorage = (response, admin, fileName, db, fileUrl) => {
	return new Promise(async (resolve, reject) => {
		try {
			const bucket = admin.storage().bucket();
			const file = bucket.file(fileName);
			request(fileUrl).pipe;
			request(fileUrl)
				.pipe(file.createWriteStream())
				.on("response", function (data) {
					console.log("content-length: " + data.headers["content-length"]);
				})
				.on("error", (err) => {
					functions.logger.info({ err });
					reject({ err });
					response.status(500).json({ err });
				})
				.on("finish", async () => {
					await setFileProgress(response, db, fileUrl, 100);
					const successMessage = { success: "File '" + fileName + "' written to Storage" };
					functions.logger.info(successMessage);
					resolve(successMessage);
				})
				.on("progress", (progress) => {
					//console.log({ progress });
				});
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

const serverAllowed = (serverHostName) => {
	return constants.allowedServers.includes(serverHostName);
};

const getHash = (input) => {
	return Buffer.from(input).toString("base64");
};
