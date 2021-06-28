import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "animate.css/animate.min.css";
import { Container } from "react-bootstrap";
import Navigation from "./components/Navigation";
import Downloader from "./components/Downloader";
import ExistingDownloads from "./components/ExistingDownloads";
import { ConfigProvider } from "./contexts/ConfigContext";
import { ToastConfigProvider } from "./contexts/ToastContext";
import CustomToast from "./components/CustomToast";

function App() {
	return (
		<Container>
			<ConfigProvider>
				<ToastConfigProvider>
					<Navigation />
					<Downloader />
					<hr />
					<ExistingDownloads />
					<CustomToast />
				</ToastConfigProvider>
			</ConfigProvider>
		</Container>
	);
}

export default App;
