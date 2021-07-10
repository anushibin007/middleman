const path = require("path");

/**
 * For now, the hash function gives a Base 64 encoding of the input
 */
exports.getHash = (input) => {
	return encodeURIComponent(Buffer.from(input).toString("base64"));
};

exports.unHash = (input) => {
	const decodedInput = decodeURIComponent(input);
	return Buffer.from(decodedInput, "base64").toString();
};

exports.getFileName = (fileUrl) => {
	return path.basename(fileUrl);
};
