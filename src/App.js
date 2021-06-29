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
import Darkmode from "darkmode-js";

function App() {
	/**
	 * Dark Mode Stuff
	 */
	const darkModeoptions = {
		label: "🌓", // default: ''
		autoMatchOsTheme: false, // default was true. But it had some glitches. So I disabled it
	};
	new Darkmode(darkModeoptions).showWidget();

	/**
	 * Rest of the App
	 */
	return (
		<Container>
			<ConfigProvider>
				<Navigation />
				<br />
				<Downloader />
				<hr />
				<ExistingDownloads />
			</ConfigProvider>
			<ToastContainer position="bottom-right" />
		</Container>
	);
}

export default App;
