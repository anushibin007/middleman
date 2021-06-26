import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "animate.css/animate.min.css";
import { Container } from "react-bootstrap";
import Navigation from "./components/Navigation";
import Downloader from "./components/Downloader";
import ExistingDownloads from "./components/ExistingDownloads";

function App() {
	return (
		<Container>
			<Navigation />
			<Downloader />
			<br />
			<ExistingDownloads />
		</Container>
	);
}

export default App;
