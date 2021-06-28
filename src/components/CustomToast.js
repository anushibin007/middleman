import { useContext } from "react";
import { Toast, Alert } from "react-bootstrap";
import { ToastContext } from "../contexts/ToastContext";

const CustomToast = () => {
	const [toastConfig, setToastConfig] = useContext(ToastContext);

	return (
		<Toast onClose={() => setToastConfig({ ...toastConfig, show: false })} show={toastConfig.show} delay={3000} autohide>
			<Alert color="default" variant={toastConfig.type}>
				<Alert.Heading>Hey!</Alert.Heading>
				<p>{toastConfig.message}</p>
			</Alert>
		</Toast>
	);
};

export default CustomToast;
