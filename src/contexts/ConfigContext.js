import React, { createContext, useEffect, useState } from "react";
import Constants from "../utils/Constants";

export const ConfigContext = createContext();

export const ConfigProvider = (props) => {
	const [configs, setConfigs] = useState({ serverUrl: "" });
	useEffect(() => {
		const stateFromLocalStorage = localStorage.getItem(Constants.LOCALSTORAGE_SERVER_URL_KEY);
		if (stateFromLocalStorage) {
			setConfigs(JSON.parse(stateFromLocalStorage));
		}
	}, []);
	useEffect(() => {
		localStorage.setItem(Constants.LOCALSTORAGE_SERVER_URL_KEY, JSON.stringify(configs));
	}, [configs]);
	return <ConfigContext.Provider value={[configs, setConfigs]}>{props.children}</ConfigContext.Provider>;
};
