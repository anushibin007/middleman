import React, { useState, useContext } from "react";
import { Accordion, Card, Row, Col, Button, Table } from "react-bootstrap";
import { ConfigContext } from "../contexts/ConfigContext";
import DownloadService from "../services/DownloadService";
import ExistingDownload from "./ExistingDownload";

const ExistingDownloads = () => {
	const [configs] = useContext(ConfigContext);

	const [existingDownloads, setExistingDownloads] = useState([]);

	const validateExistingDownloads = () => {
		if (existingDownloads.length !== 0) {
			return existingDownloads.map((aDownload) => <ExistingDownload item={aDownload} />);
		} else {
			return (
				<tr>
					<td colSpan={3}>No results found. Try fetching again.</td>
				</tr>
			);
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
			<Row>
				<Col>
					<h5>Files in Middleman</h5>
				</Col>
				<Col>
					<Button variant="warning" onClick={fetchExisting} className="float-end">
						<i className="bi bi-x-octagon"></i> Fetch
					</Button>
				</Col>
			</Row>
			<Row>
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Original Download URL</th>
							<th>Status</th>
							<th>Download from Middleman</th>
						</tr>
					</thead>
					<tbody>{validateExistingDownloads()}</tbody>
				</Table>
			</Row>
		</Accordion>
	);
};

export default ExistingDownloads;
