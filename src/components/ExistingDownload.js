import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { ConfigContext } from "../contexts/ConfigContext";
import { toast } from "react-toastify";

const ExistingDownload = (props) => {
	const [configs] = useContext(ConfigContext);

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
		if (existingDownload.status === "done") return false;
		return true;
	};

	const downloadFileFromMiddleman = () => {
		window.open(existingDownload.middlemanUrl);
	};

	const deleteFileFromMiddleman = () => {
		// DownloadService.deleteFile(configs.serverUrl, existingDownload.id);
		toast("🚀 Still under Development. Stay Tuned!");
	};

	return (
		<tr className={getRowColorClassName()}>
			<td>
				<a href={existingDownload.downloadUrl}>{existingDownload.downloadUrl}</a>
			</td>
			<td>{existingDownload.status}</td>
			<td>
				<Button variant="success" disabled={getButtonsDisabledStatus()} onClick={downloadFileFromMiddleman}>
					<i className="bi bi-download"></i>&nbsp;Download
				</Button>
			</td>
			<td>
				<Button variant="danger" disabled={getButtonsDisabledStatus()} onClick={deleteFileFromMiddleman}>
					<i className="bi bi-trash"></i>&nbsp;Delete
				</Button>
			</td>
		</tr>
	);
};

export default ExistingDownload;
