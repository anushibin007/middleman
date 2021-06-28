import axios from "axios";
import { toast } from "react-toastify";

class DownloadService {
	downloadFile(serverUrl, downloadUrl) {
		if (serverUrl !== "") return axios.get(serverUrl + "/download?downloadUrl=" + downloadUrl);
		else this.showErrorMessage();
	}

	getExistingDownloads(serverUrl) {
		if (serverUrl !== "") return axios.get(serverUrl + "/api/middlemanDocs?size=100");
		else this.showErrorMessage();
	}

	deleteFile(serverUrl, fileId) {
		if (serverUrl !== "") {
			toast.warning("🧯 File deleted from middleman cache");
			return axios.get(serverUrl + "/delete?id=" + fileId);
		} else this.showErrorMessage();
	}

	showErrorMessage() {
		toast.error('💔 The "Server URL" cannot be empty. Please specify one in the Config');
	}
}

export default new DownloadService();
