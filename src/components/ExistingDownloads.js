import React, { useEffect, useState } from "react";
import { Accordion, Row, Col, Table } from "react-bootstrap";
import ExistingDownload from "./ExistingDownload";
import { toast } from "react-toastify";
import firebase from "firebase";

const ExistingDownloads = () => {
	/**
	 * The state which stores the existing downloads as an array
	 */
	const [existingDownloads, setExistingDownloads] = useState({});

	const db = firebase.database();
	const dbRef = db.ref("files/");

	/**
	 * Initial setup
	 */
	useEffect(() => {
		dbRef.on(
			"value",
			async (snapshot) => {
				setExistingDownloads(snapshot.val());
			},
			(errorObject) => {
				toast.error("Could not read from DB: " + errorObject.name);
			}
		);

		window.onbeforeunload = () => {
			// Make sure to disconnect the DB ref when the page unloads
			dbRef.off();
		};
	}, []);

	/**
	 * This function helps with rendering the output on the UI based on whether there are existing downloads or not
	 */
	const validateExistingDownloads = () => {
		if (existingDownloads && Object.keys(existingDownloads).length > 0) {
			let renderResponse = [];
			for (var key in existingDownloads) {
				renderResponse.push(<ExistingDownload item={existingDownloads[key]} key={key} />);
			}
			return renderResponse;
		} else {
			return (
				<tr>
					<td colSpan={5}>💡 Nothing cached to Middleman</td>
				</tr>
			);
		}
	};

	return (
		<Accordion defaultActiveKey="0">
			<Row>
				<Col>
					<h5>Files in Middleman ({existingDownloads ? Object.keys(existingDownloads).length : 0})</h5>
				</Col>
			</Row>
			<Row>
				<Table striped bordered hover responsive>
					<thead>
						<tr>
							<th>Original Download URL</th>
							<th>Size (MB)</th>
							<th>
								Download <br />
								from Middleman
							</th>
							<th>Status</th>
							<th>Created Time</th>
						</tr>
					</thead>
					<tbody>{validateExistingDownloads()}</tbody>
				</Table>
			</Row>
		</Accordion>
	);
};

export default ExistingDownloads;
