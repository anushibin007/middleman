import React, { useState, useContext } from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import DownloadService from "../services/DownloadService";
import { ConfigContext } from "../contexts/ConfigContext";
import { loadProgressBar } from "axios-progress-bar";
import "axios-progress-bar/dist/nprogress.css";
import { toast } from "react-toastify";

const Downloader = () => {
	const [downloadUrl, setDownloadUrl] = useState("");
	const [configs] = useContext(ConfigContext);

	const handleDownloadUrlChanged = (e) => {
		setDownloadUrl(e.target.value);
	};

	const handleDownloadClicked = () => {
		if (configs.serverUrl) {
			if (downloadUrl) {
				loadProgressBar();
				setDownloadUrl("");
				toast.success("✅ Download queued. Refresh to see the progress");
				DownloadService.downloadFile(configs.serverUrl, downloadUrl)
					.then(() => {
						//if download was successful
					})
					.catch((err) => {
						//if download failed
						toast.error("😢 Sorry, an error occured: " + err);
					});
			} else {
				toast.error("💔 Download URL cannot be empty");
			}
		} else {
			DownloadService.showErrorMessage();
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
