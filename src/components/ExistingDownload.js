import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const ExistingDownload = (props) => {
	const [existingDownload, setExistingDownload] = useState([]);

	useEffect(() => {
		setExistingDownload(props.item);
	}, [existingDownload]);

	return (
		<tr>
			<td>{existingDownload.downloadUrl}</td>
			<td>{existingDownload.status}</td>
			<td>
				<a href={existingDownload.middlemanUrl}>
					<Button variant="success">
						<i className="bi bi-download"></i>&nbsp;Download
					</Button>
				</a>
			</td>
		</tr>
	);
};

export default ExistingDownload;
