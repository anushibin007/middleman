const constants = require("../utils/constants");
const functions = require("firebase-functions");
const path = require("path");
const request = require("request");

const DB_NAME = "files";
const USER_ID = "public";

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

const uploadFileToStorage = async (response, admin, fileName, db, fileUrl) => {
	const start = new Date();
	var secondsLogged = [];
	const fileSize = await getFileSize(fileUrl);
	functions.logger.info({ fileSize });
	const bucket = admin.storage().bucket(USER_ID);
	const file = bucket.file(fileName);

	return new Promise(async (resolve, reject) => {
		try {
			request(fileUrl)
				.pipe(file.createWriteStream())
				.on("progress", (progress) => {
					// Update the progress only if we have a valid file size.
					// Else it will get directly updated to 100 in the end.
					if (fileSize > 0) {
						// get seconds elapsed in rounded time like 0, 1, 2, ...
						const secondsElapsed = parseInt((new Date() - start) / 1000);

						// Update progress every 5 seconds
						if (!secondsLogged.includes(secondsElapsed) && secondsElapsed % 5 == 0) {
							// Record that we have logged progress at x seconds already
							secondsLogged.push(secondsElapsed);

							// Log the progress %
							const progressPercent = parseInt((progress.bytesWritten / fileSize) * 100);
							setFileProgress(response, db, fileUrl, progressPercent);
							functions.logger.info({ progressPercent });
						}
					}
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

const getFileSize = async (fileUrl) => {
	return new Promise((resolve) => {
		request(
			{
				url: fileUrl,
				method: "HEAD",
			},
			(err, response) => {
				if (err) {
					functions.logger.warn("Error while trying to check file size", { err });
					// This could also mean that the file is not accessible properly.
					// So set the progress to -1 just in case
					setFileProgress(response, db, fileUrl, -1);
					resolve(-1);
				}
				const fileSize = response.headers["content-length"];
				if (fileSize) {
					functions.logger.warn("Could not get file size from header. Setting it to -1");
					resolve(parseInt(fileSize));
				} else {
					resolve(-1);
				}
			}
		);
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
