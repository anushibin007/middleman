import React, { useState } from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";

const Downloader = () => {
	const [downloadUrl, setDownloadUrl] = useState("");

	const handleDownloadUrlChanged = (e) => {
		setDownloadUrl(e.target.value);
	};

	return (
		<React.Fragment>
			<InputGroup>
				<FormControl placeholder="Download URL" value={downloadUrl} onChange={handleDownloadUrlChanged} aria-label="Download URL" />
				<InputGroup.Append>
					<Button>Download</Button>
				</InputGroup.Append>
			</InputGroup>
		</React.Fragment>
	);
};

export default Downloader;
