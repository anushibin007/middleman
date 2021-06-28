import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

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

	const getDownloadButtonDisabledStatus = () => {
		if (existingDownload.status === "done") return false;
		return true;
	};

	const downloadFileFromMiddleman = () => {
		window.open(existingDownload.middlemanUrl);
	};

	return (
		<tr className={getRowColorClassName()}>
			<td>
				<a href={existingDownload.downloadUrl}>{existingDownload.downloadUrl}</a>
			</td>
			<td>{existingDownload.status}</td>
			<td>
				<Button variant="success" disabled={getDownloadButtonDisabledStatus()} onClick={downloadFileFromMiddleman}>
					<i className="bi bi-download"></i>&nbsp;Download
				</Button>
			</td>
		</tr>
	);
};

export default ExistingDownload;
