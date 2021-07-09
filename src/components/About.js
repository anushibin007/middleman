import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "../css/heart.css";

function About() {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<React.Fragment>
			<Button variant="navbar-btn" onClick={handleShow}>
				👱‍♂️ About Me
			</Button>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header>
					<Modal.Title>👱‍♂️ About Me</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="d-flex flex-column">
						<div className="d-flex justify-content-center">
							Designed & Developed with <span className="heart animate__animated animate__heartBeat animate__infinite px-1">♥</span> by{" "}
							<a className="px-1" href="https://github.com/anushibin007/middleman">
								Anu Shibin Joseph Raj
							</a>
						</div>
						<br />
						<div className="d-flex justify-content-center">
							{/* This line shows the actual counter */}
							<img src="https://www.freevisitorcounters.com/en/counter/render/842593/t/0" border="0" className="counterimg" alt="Visitor Counter"></img>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="info" onClick={handleClose}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</React.Fragment>
	);
}
export default About;
