import React, { useState, useContext } from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import DownloadService from "../services/DownloadService";
import { ConfigContext } from "../contexts/ConfigContext";

const Downloader = () => {
	const [downloadUrl, setDownloadUrl] = useState("");
	const [configs] = useContext(ConfigContext);

	const handleDownloadUrlChanged = (e) => {
		setDownloadUrl(e.target.value);
	};

	const handleDownloadClicked = () => {
		DownloadService.downloadFile(configs.serverUrl, downloadUrl);
		setDownloadUrl("");
	};

	return (
		<React.Fragment>
			<InputGroup>
				<InputGroup.Prepend>
					<InputGroup.Text>
						<i className="bi bi-link-45deg"></i>
					</InputGroup.Text>
				</InputGroup.Prepend>
				<FormControl placeholder="Download URL" value={downloadUrl} onChange={handleDownloadUrlChanged} aria-label="Download URL" />
				<InputGroup.Append>
					<Button onClick={handleDownloadClicked}>
						<i className="bi bi-download"></i>&nbsp;Download to Middleman
					</Button>
				</InputGroup.Append>
			</InputGroup>
		</React.Fragment>
	);
};

export default Downloader;
