const constants = require("../utils/constants");
const functions = require("firebase-functions");
const path = require("path");
const request = require("request");

// Constants
const DB_NAME = "files";
const FOLDER_NAME = "public";

// Global variables
let httpRequest = undefined;
let httpResponse = undefined;
let admin = undefined;
let db = undefined;
let fileUrl = undefined;

// Entry point
exports.handler = async (aRequest, aResponse, anAdmin) => {
	/**
	 * VERY IMPORTANT step here. All global variables are INJECTED here and ONLY here
	 */
	httpRequest = aRequest;
	httpResponse = aResponse;
	fileUrl = httpRequest.query.fileUrl;
	admin = anAdmin;
	db = admin.database();

	functions.logger.info("Entering upload function", { "request.hostname": httpRequest.hostname });
	if (hasAllAccessChecksPassed()) {
		if (fileUrl) {
			const fileName = getFileName();
			// Check if the file already exists
			let fileExists = await checkIfFileExists();

			// If the file is not present in the DB. Fetch it
			if (!fileExists) {
				try {
					// Add an entry to DB
					await insertFileMetadata();

					// pipe the remote stream to the Storage
					uploadFileToStorage(fileName);

					httpResponse.json({ success: fileUrl + " scheduled successfully. Refresh to see progress.", kind: "scheduled" });
				} catch (err) {
					try {
						setFileProgress(-1);
					} catch (err) {
						// ignore the error
					}
					const failureMessage = "FATAL Error. Could not serve the request";
					functions.logger.error(failureMessage, { err });
					httpResponse.status(500).json(failureMessage, { err });
				}
			} else {
				httpResponse.json({ success: fileUrl + " already exists", kind: "exists", data: fileExists });
			}
		} else {
			const failureMessage = { error: "fileUrl missing" };
			functions.logger.error(failureMessage);
			httpResponse.status(400).json(failureMessage);
		}
	} else {
		const failureMessage = { error: "Access Forbidden to " + httpRequest.hostname };
		functions.logger.error(failureMessage);
		httpResponse.status(403).json(failureMessage);
	}
};

const checkIfFileExists = () => {
	const id = getId();
	return new Promise((resolve) => {
		db.ref(DB_NAME)
			.child(id)
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

const uploadFileToStorage = async (fileName) => {
	const start = new Date();
	var secondsLogged = [];
	const fileSize = await getFileSize();
	functions.logger.info({ fileSize });
	const bucket = admin.storage().bucket();
	const file = bucket.file(FOLDER_NAME + "/" + fileName);

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
							setFileProgress(progressPercent);
							functions.logger.info({ progressPercent });
						}
					}
				})
				.on("error", async (err) => {
					await setFileProgress(-1);
					functions.logger.error({ err });
					reject({ err });
				})
				.on("finish", async () => {
					await setFileProgress(100);
					const successMessage = { success: "File '" + fileName + "' written to Storage" };
					functions.logger.info(successMessage);
					resolve(successMessage);
				});
		} catch (err) {
			const failureMessage = { err: err, message: "Cannot upload file to Storage" };
			setFileProgress(-1);
			functions.logger.error(failureMessage);
			reject(failureMessage);
		}
	});
};

const getFileSize = async () => {
	return new Promise((resolve) => {
		request(
			{
				url: fileUrl,
				method: "HEAD",
			},
			(err, requestResponse) => {
				if (err) {
					functions.logger.warn("Error while trying to check file size", { err });
					// This could also mean that the file is not accessible properly.
					// So set the progress to -1 just in case
					setFileProgress(-1);
					resolve(-1);
				}
				const fileSize = requestResponse.headers["content-length"];
				if (fileSize) {
					const fileSizeInt = parseInt(fileSize);
					setFileSizeOnDb(fileSizeInt);
					resolve(fileSizeInt);
				} else {
					functions.logger.warn("Could not get file size from header. Setting it to -1");
					resolve(-1);
				}
			}
		);
	});
};

const setDBMetadata = (dataToWriteToDb) => {
	return new Promise((resolve, reject) => {
		id = getId();
		db.ref(DB_NAME + "/" + id)
			.update(dataToWriteToDb)
			.then(() => {
				functions.logger.info(dataToWriteToDb);
				resolve(dataToWriteToDb);
			})
			.catch(async (err) => {
				await setFileProgress(-1);
				functions.logger.error({ err: err });
				reject({ err: err });
			});
	});
};

const insertFileMetadata = async () => {
	const dataToWriteToDb = {
		fileName: getFileName(),
		fileUrl: fileUrl,
		createdAt: new Date().getTime(),
		progress: 0,
	};
	await setDBMetadata(dataToWriteToDb);
};

const setFileProgress = async (progress) => {
	const dataToWriteToDb = {
		progress: progress,
	};
	await setDBMetadata(dataToWriteToDb);
};

const setFileSizeOnDb = async (size) => {
	const dataToWriteToDb = {
		size: size,
	};
	await setDBMetadata(dataToWriteToDb);
};

const hasAllAccessChecksPassed = () => {
	let accessCheckConditions = false;
	// Check if the requesting server is in the list of allowed servers
	accessCheckConditions = constants.allowedServers.includes(httpRequest.hostname);
	return accessCheckConditions;
};

/**
 * Generate the ID from the hash of the file URL
 */
const getId = () => {
	return getHash(fileUrl);
};

const getFileName = () => {
	return path.basename(fileUrl);
};

/**
 * For now, the hash function gives a Base 64 encoding of the input
 */
const getHash = (input) => {
	return Buffer.from(input).toString("base64");
};
