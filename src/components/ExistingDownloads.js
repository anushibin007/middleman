import React, { useState } from "react";
import { Accordion, Row, Col, Button, Table } from "react-bootstrap";
import DownloadService from "../services/DownloadService";
import ExistingDownload from "./ExistingDownload";
import { toast } from "react-toastify";

const ExistingDownloads = () => {
	/**
	 * The state which stores the existing downloads as an array
	 */
	const [existingDownloads, setExistingDownloads] = useState([]);

	/**
	 * The funtion that makes an AJAX call to the server and gets the existing downloads as JSON
	 */
	const fetchExisting = () => {
		DownloadService.getExistingDownloads()
			.then((response) => {
				setExistingDownloads(response.data._embedded.middlemanDocs);
			})
			.catch((err) => {
				toast.error("😢 Sorry, an error occured: " + err);
			});
	};

	/**
	 * This function helps with rendering the output on the UI based on whether there are existing downloads or not
	 */
	const validateExistingDownloads = () => {
		if (existingDownloads.length !== 0) {
			return existingDownloads.map((aDownload) => <ExistingDownload item={aDownload} key={aDownload.id} />);
		} else {
			return (
				<tr>
					<td colSpan={4}>No results found. Try fetching again.</td>
				</tr>
			);
		}
	};

	return (
		<Accordion defaultActiveKey="0">
			<Row>
				<Col>
					<h5>Files in Middleman</h5>
				</Col>
				<Col>
					<Button variant="warning" onClick={fetchExisting} className="float-end">
						<i className="bi bi-arrow-repeat"></i> Refresh
					</Button>
				</Col>
			</Row>
			<Row>
				<Table striped bordered hover responsive>
					<thead>
						<tr>
							<th>Original Download URL</th>
							<th>Status</th>
							<th>Download from Middleman</th>
							<th>Delete from Middleman</th>
						</tr>
					</thead>
					<tbody>{validateExistingDownloads()}</tbody>
				</Table>
			</Row>
		</Accordion>
	);
};

export default ExistingDownloads;
