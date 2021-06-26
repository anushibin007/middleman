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
				<InputGroup.Prepend>
					<InputGroup.Text>
						<i class="bi bi-link-45deg"></i>
					</InputGroup.Text>
				</InputGroup.Prepend>
				<FormControl placeholder="Download URL" value={downloadUrl} onChange={handleDownloadUrlChanged} aria-label="Download URL" />
				<InputGroup.Append>
					<Button>
						<i className="bi bi-download"></i> Download to Middleman
					</Button>
				</InputGroup.Append>
			</InputGroup>
		</React.Fragment>
	);
};

export default Downloader;
