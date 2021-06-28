import React, { createContext, useState } from "react";

export const ToastContext = createContext();

export const ToastConfigProvider = (props) => {
	const [toastConfig, setToastConfig] = useState({ show: false, message: "", type: "" });

	return <ToastContext.Provider value={[toastConfig, setToastConfig]}>{props.children}</ToastContext.Provider>;
};
