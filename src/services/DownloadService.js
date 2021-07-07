import axios from "axios";
import { toast } from "react-toastify";
import Constants from "../utils/Constants";

class DownloadService {
	uploadFile(fileUrl) {
		return axios.get(Constants.SERVER_URL + "/upload?fileUrl=" + fileUrl);
	}

	getExistingDownloads() {
		return axios.get(Constants.SERVER_URL + "/getexisting");
	}

	async deleteFile(fileId) {
		return axios.get(Constants.SERVER_URL + "/delete?id=" + fileId).then(() => {
			toast.warning("🧯 File deleted from middleman cache");
		});
	}

	showErrorMessage() {
		toast.error('💔 The "Server URL" cannot be empty. Please specify one in the Config');
	}
}

export default new DownloadService();
