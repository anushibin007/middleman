import React, { useState, useContext } from "react";
import { Button, Modal, InputGroup, FormControl } from "react-bootstrap";
import "../css/heart.css";
import { ConfigContext } from "../contexts/ConfigContext";

function Config() {
	/**
	 * Get the config from the global context
	 */
	const [configs, setConfigs] = useContext(ConfigContext);

	/**
	 * State that holds whether the modal is shown or not
	 */
	const [show, setShow] = useState(false);

	/**
	 * Use a local variable to store the configuration. This will be permanently written to the context variable only when clicking "Save"
	 */
	const [localConfigHolder, setLocalConfigHolder] = useState({});

	/**
	 * Closing the Config Modal
	 */
	const handleClose = () => setShow(false);

	/**
	 * Opening the Config Modal. This will also copy the configs from the global context into the local variable
	 */
	const handleShow = () => {
		setLocalConfigHolder({ ...configs });
		setShow(true);
	};

	/**
	 * Whenever the config is updated on the UI, just store it into the local variable.
	 * Wait till the Save button is clicked. Then copy it to the global context.
	 */
	const handleConfigChanged = (e) => {
		setLocalConfigHolder({ ...configs, [e.target.name]: e.target.value });
	};

	/**
	 * Save the local config into the Global Context
	 */
	const handleSave = () => {
		setConfigs(localConfigHolder);
		handleClose();
	};

	return (
		<React.Fragment>
			<Button variant="navbar-btn" onClick={handleShow}>
				<i className="bi bi-gear"></i>&nbsp;Config
			</Button>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header>
					<Modal.Title>
						<i className="bi bi-gear"></i>&nbsp;Config
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="d-flex flex-column">
						<InputGroup>
							<InputGroup.Prepend>
								<InputGroup.Text>
									<i className="bi bi-link-45deg"></i>&nbsp;Server URL
								</InputGroup.Text>
							</InputGroup.Prepend>
							<FormControl placeholder="https://middleman-backend-server.herokuapp.com" name="serverUrl" value={localConfigHolder.serverUrl} onChange={handleConfigChanged} aria-label="Server URL" />
						</InputGroup>
						<br />
						<InputGroup>
							<InputGroup.Prepend>
								<InputGroup.Text>
									<i className="bi bi-envelope"></i>&nbsp;Your Mail ID
								</InputGroup.Text>
							</InputGroup.Prepend>
							<FormControl type="email" placeholder="me@gmail.com" name="userMailId" value={localConfigHolder.userMailId} onChange={handleConfigChanged} aria-label="Server URL" />
						</InputGroup>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={handleClose}>
						<i className="bi bi-x-circle"></i>&nbsp;Close
					</Button>
					<Button variant="success" onClick={handleSave}>
						<i className="bi bi-save"></i>&nbsp;Save
					</Button>
				</Modal.Footer>
			</Modal>
		</React.Fragment>
	);
}
export default Config;
