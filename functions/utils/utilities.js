/**
 * For now, the hash function gives a Base 64 encoding of the input
 */
exports.getHash = (input) => {
	return encodeURIComponent(Buffer.from(input).toString("base64"));
};
