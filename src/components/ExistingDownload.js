import React from "react";
import { useEffect, useState } from "react";
import { Button, ProgressBar } from "react-bootstrap";
import { toast } from "react-toastify";
import DownloadService from "../services/DownloadService";

const ExistingDownload = (props) => {
	const [existingDownload, setExistingDownload] = useState([]);

	useEffect(() => {
		setExistingDownload(props.item);
	}, [props.item]);

	const downloadFileFromMiddleman = () => {
		window.open(existingDownload.publicUrl);
	};

	const deleteFileFromMiddleman = () => {
		DownloadService.deleteFile(existingDownload.id);
	};

	const retryDownload = () => {
		toast("🚀 Still under Development. Stay Tuned!");
	};

	const getDownloadProgress = () => {
		if (existingDownload.progress === 0) {
			return (
				<React.Fragment>
					🏗 Staging your file
					<ProgressBar variant="warning" now={100} animated></ProgressBar>
				</React.Fragment>
			);
		} else if (isDownloadComplete()) {
			return (
				<React.Fragment>
					✅ Complete
					<br />
					{getWarnings()}
				</React.Fragment>
			);
		} else if (existingDownload.progress === -1) {
			return <React.Fragment>❗ Errored</React.Fragment>;
		} else {
			return (
				<React.Fragment>
					▶ {existingDownload.progress}
					<ProgressBar now={existingDownload.progress} animated></ProgressBar>
				</React.Fragment>
			);
		}
	};

	const getWarnings = () => {
		if (existingDownload.statusCode && !(existingDownload.statusCode >= 200 && existingDownload.statusCode < 300)) {
			return (
				<React.Fragment>
					⚠ <i>Your request returned a {existingDownload.statusCode}. The file in middleman might not be what you expect</i>
				</React.Fragment>
			);
		}
	};

	const getFileSize = () => {
		if (existingDownload.size) {
			const size = Math.round((existingDownload.size / 1024 / 1024) * 100) / 100;
			return size;
		}
	};

	const getDownloadLink = () => {
		if (isDownloadComplete() && existingDownload.publicUrl) {
			return <Button onClick={downloadFileFromMiddleman}>Download</Button>;
		} else {
			return "⏳";
		}
	};

	const isDownloadComplete = () => {
		return existingDownload.progress === 100;
	};

	return (
		<tr>
			<td>
				<a href={existingDownload.fileUrl}>{existingDownload.fileName}</a>
			</td>
			<td>{getFileSize()}</td>
			<td>{getDownloadLink()}</td>
			<td>{getDownloadProgress()}</td>
			<td>
				{new Date(existingDownload.createdAt).toDateString()}
				<br />
				{new Date(existingDownload.createdAt).toLocaleTimeString()}
			</td>
		</tr>
	);
};

export default ExistingDownload;
