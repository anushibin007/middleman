import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "animate.css/animate.min.css";
import { Container } from "react-bootstrap";
import Navigation from "./components/Navigation";
import Downloader from "./components/Downloader";
import ExistingDownloads from "./components/ExistingDownloads";
import { ConfigProvider } from "./contexts/ConfigContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
	return (
		<Container>
			<ConfigProvider>
				<Navigation />
				<Downloader />
				<hr />
				<ExistingDownloads />
			</ConfigProvider>
			<ToastContainer position="bottom-right" />
		</Container>
	);
}

export default App;
