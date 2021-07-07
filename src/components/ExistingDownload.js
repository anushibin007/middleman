import { useEffect, useState } from "react";
import { Button, ProgressBar } from "react-bootstrap";
import { toast } from "react-toastify";
import DownloadService from "../services/DownloadService";

const ExistingDownload = (props) => {
	const [existingDownload, setExistingDownload] = useState([]);

	useEffect(() => {
		setExistingDownload(props.item);
	}, [props.item]);

	const getRowColorClassName = () => {
		if (existingDownload.status === "done") return "table-success";
		if (existingDownload.status === "in progress") return "table-warning";
		if (existingDownload.status === "error") return "table-danger";
	};

	const getButtonsDisabledStatus = () => {
		if (existingDownload.status === "done" || existingDownload.status === "error") return false;
		return true;
	};

	const downloadFileFromMiddleman = () => {
		window.open(existingDownload.middlemanUrl);
	};

	const deleteFileFromMiddleman = () => {
		DownloadService.deleteFile(existingDownload.id);
	};

	const getExistingDownloadUrl = () => {
		if (existingDownload.status === "error") {
			return existingDownload.downloadUrl;
		} else {
			return <a href={existingDownload.downloadUrl}>{existingDownload.downloadUrl}</a>;
		}
	};

	const retryDownload = () => {
		toast("🚀 Still under Development. Stay Tuned!");
	};

	const getDownloadOrRetryButton = () => {
		if (existingDownload.status === "error") {
			return (
				<Button variant="warning" disabled={getButtonsDisabledStatus()} onClick={retryDownload}>
					<i className="bi bi-download"></i>&nbsp;Retry
				</Button>
			);
		} else {
			return (
				<Button variant="success" disabled={getButtonsDisabledStatus()} onClick={downloadFileFromMiddleman}>
					<i className="bi bi-download"></i>&nbsp;Download
				</Button>
			);
		}
	};

	/*return 
		<tr className={getRowColorClassName()}>
			<td>{getExistingDownloadUrl()}</td>
			<td>{existingDownload.status}</td>
			<td>{getDownloadOrRetryButton()}</td>
			<td>
				<Button variant="danger" disabled={getButtonsDisabledStatus()} onClick={deleteFileFromMiddleman}>
					<i className="bi bi-trash"></i>&nbsp;Delete
				</Button>
			</td>
	</tr>
	*/
	return (
		<tr>
			<td>{existingDownload.fileUrl}</td>
			<td>
				{existingDownload.progress}
				<ProgressBar now={existingDownload.progress} animated></ProgressBar>
			</td>
			<td>{existingDownload.fileName}</td>
			<td>{existingDownload.createdAt}</td>
		</tr>
	);
};

export default ExistingDownload;
