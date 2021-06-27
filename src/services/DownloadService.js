import axios from "axios";
class DownloadService {
	downloadFile(serverUrl, downloadUrl) {
		return axios.get(serverUrl + "/download?downloadUrl=" + downloadUrl);
	}

	getExistingDownloads(serverUrl) {
		if (serverUrl !== "") return axios.get(serverUrl + "/api/middlemanDocs?size=100");
	}
}

export default new DownloadService();
