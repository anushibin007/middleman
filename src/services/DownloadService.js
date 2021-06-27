import axios from "axios";
import React, { useContext } from "react";
class DownloadService {
	downloadFile(serverUrl, downloadUrl) {
		return axios.get(serverUrl + "/download?downloadUrl=" + downloadUrl);
	}
}

export default new DownloadService();
