import React, { useState, useContext } from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import DownloadService from "../services/DownloadService";
import { ConfigContext } from "../contexts/ConfigContext";
import { loadProgressBar } from "axios-progress-bar";
import "axios-progress-bar/dist/nprogress.css";

const Downloader = () => {
	const [downloadUrl, setDownloadUrl] = useState("");
	const [configs, setConfigs] = useContext(ConfigContext);

	const handleDownloadUrlChanged = (e) => {
		setDownloadUrl(e.target.value);
	};

	const handleDownloadClicked = () => {
		if (downloadUrl !== "") {
			loadProgressBar();
			DownloadService.downloadFile(configs.serverUrl, downloadUrl)
				.then(() => {
					//if download was successful
					setDownloadUrl("");
				})
				.catch((err) => {
					//if download failed
					alert("Sorry, an error occured: " + err);
				});
		} else {
			alert("Please enter a download URL");
		}
	};

	return (
		<React.Fragment>
			<h5>Cache files to Middleman</h5>
			<InputGroup>
				<InputGroup.Prepend>
					<InputGroup.Text>
						<i className="bi bi-link-45deg"></i>
					</InputGroup.Text>
				</InputGroup.Prepend>
				<FormControl placeholder="Download URL" value={downloadUrl} onChange={handleDownloadUrlChanged} aria-label="Download URL" />
				<InputGroup.Append>
					<Button onClick={handleDownloadClicked} type="submit">
						<i className="bi bi-download"></i>&nbsp;Cache to Middleman
					</Button>
				</InputGroup.Append>
			</InputGroup>
		</React.Fragment>
	);
};

export default Downloader;
