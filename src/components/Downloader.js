import React, { useState } from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import DownloadService from "../services/DownloadService";
import { loadProgressBar } from "axios-progress-bar";
import "axios-progress-bar/dist/nprogress.css";
import { toast } from "react-toastify";

const Downloader = () => {
	const [fileUrl, setFileUrl] = useState("");

	const handleDownloadUrlChanged = (e) => {
		setFileUrl(e.target.value);
	};

	const handleDownloadClicked = (e) => {
		e.preventDefault();
		if (fileUrl) {
			loadProgressBar();
			setFileUrl("");
			toast.success("✅ Download queued");
			DownloadService.uploadFile(fileUrl)
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
	};

	return (
		<React.Fragment>
			<h5>Cache files to Middleman</h5>
			<form onSubmit={handleDownloadClicked}>
				<InputGroup>
					<InputGroup.Prepend>
						<InputGroup.Text>
							<i className="bi bi-link-45deg"></i>
						</InputGroup.Text>
					</InputGroup.Prepend>
					<FormControl placeholder="Download URL" value={fileUrl} onChange={handleDownloadUrlChanged} aria-label="Download URL" />
					<InputGroup.Append>
						<Button onClick={handleDownloadClicked} type="submit">
							<i className="bi bi-download"></i>&nbsp;Cache to Middleman
						</Button>
					</InputGroup.Append>
				</InputGroup>
			</form>
		</React.Fragment>
	);
};

export default Downloader;
