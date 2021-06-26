import React, { useState, useContext } from "react";
import { Button, Modal, InputGroup, FormControl } from "react-bootstrap";
import "../css/heart.css";
import { ConfigContext } from "../contexts/ConfigContext";

function Context() {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [configs, setConfigs] = useContext(ConfigContext);

	const handleServerUrlChanged = (e) => {
		const aServerUrl = e.target.value;
		setConfigs({ serverUrl: aServerUrl });
	};

	return (
		<React.Fragment>
			<Button variant="navbar-btn" onClick={handleShow}>
				Config
			</Button>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header>
					<Modal.Title>Config</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="d-flex flex-column">
						<InputGroup>
							<InputGroup.Prepend>
								<InputGroup.Text>
									<i class="bi bi-link-45deg"></i> Server URL
								</InputGroup.Text>
							</InputGroup.Prepend>
							<FormControl placeholder="https://middleman-server.com" value={configs.serverUrl} onChange={handleServerUrlChanged} aria-label="Server URL" />
						</InputGroup>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="info" onClick={handleClose}>
						Save
					</Button>
				</Modal.Footer>
			</Modal>
		</React.Fragment>
	);
}
export default Context;
