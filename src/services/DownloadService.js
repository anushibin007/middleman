import axios from "axios";
class DownloadService {
	downloadFile(serverUrl, downloadUrl) {
		return axios.get(serverUrl + "/download?downloadUrl=" + downloadUrl);
	}

	getExistingDownloads(serverUrl) {
		if (serverUrl !== "") return axios.get(serverUrl + "/api/middlemanDocs?size=100");
	}

	deleteFile(serverUrl, fileId) {
		if (serverUrl !== "") return axios.delete(serverUrl + "/api/middlemanDocs/" + fileId);
	}
}

export default new DownloadService();
