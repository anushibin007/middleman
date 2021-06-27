import React, { useState, useContext } from "react";
import { Accordion, Card, Row, Col, Button } from "react-bootstrap";
import { ConfigContext } from "../contexts/ConfigContext";
import DownloadService from "../services/DownloadService";

const ExistingDownloads = () => {
	const [configs] = useContext(ConfigContext);

	const [existingDownloads, setExistingDownloads] = useState([]);

	const validateExistingDownloads = () => {
		if (existingDownloads.length !== 0) {
			console.log(existingDownloads[0].id);
			return existingDownloads.map((aDownload) => (
				<p key={aDownload.id}>
					{aDownload.downloadUrl} | {aDownload.status}
				</p>
			));
		} else {
			return <p>none</p>;
		}
	};

	const fetchExisting = () => {
		DownloadService.getExistingDownloads(configs.serverUrl).then((response) => {
			console.log(response.data);
			setExistingDownloads(response.data._embedded.middlemanDocs);
		});
	};

	return (
		<Accordion defaultActiveKey="0">
			<Card>
				<Row>
					<Col>
						<Accordion.Toggle as={Card.Header} eventKey="0">
							<h5>Files in Middleman</h5>
						</Accordion.Toggle>
					</Col>
					<Col>
						<Button variant="warning" onClick={fetchExisting} className="float-end">
							<i className="bi bi-x-octagon"></i> Fetch
						</Button>
					</Col>
				</Row>
				<Accordion.Collapse eventKey="0">
					<Card.Body>{validateExistingDownloads()}</Card.Body>
				</Accordion.Collapse>
			</Card>
		</Accordion>
	);
};

export default ExistingDownloads;
