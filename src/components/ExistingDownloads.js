import React from "react";
import { Accordion, Card } from "react-bootstrap";

const ExistingDownloads = () => {
	return (
		<Accordion defaultActiveKey="0">
			<Card>
				<Accordion.Toggle as={Card.Header} eventKey="0">
					<h5>Files in the Cache</h5>
				</Accordion.Toggle>
				<Accordion.Collapse eventKey="0">
					<Card.Body></Card.Body>
				</Accordion.Collapse>
			</Card>
		</Accordion>
	);
};

export default ExistingDownloads;
