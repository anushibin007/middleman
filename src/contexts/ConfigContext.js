import React, { createContext, useEffect, useState } from "react";
import Constants from "../utils/Constants";

export const ConfigContext = createContext();

export const ConfigProvider = (props) => {
	const [configs, setConfigs] = useState({ serverUrl: "", userMailId: "" });
	/**
	 * Try to load the configs for the first time from local storage
	 */
	useEffect(() => {
		const stateFromLocalStorage = localStorage.getItem(Constants.LOCALSTORAGE_SERVER_URL_KEY);
		if (stateFromLocalStorage) {
			setConfigs(JSON.parse(stateFromLocalStorage));
		}
	}, []);

	/**
	 * Every time the config changes, store it to local storage
	 */
	useEffect(() => {
		localStorage.setItem(Constants.LOCALSTORAGE_SERVER_URL_KEY, JSON.stringify(configs));
	}, [configs]);

	return <ConfigContext.Provider value={[configs, setConfigs]}>{props.children}</ConfigContext.Provider>;
};
