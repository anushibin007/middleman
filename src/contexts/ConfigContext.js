import React, { createContext, useEffect, useState } from "react";
import Constants from "../utils/Constants";
import firebase from "firebase";
import "firebase/analytics";

export const ConfigContext = createContext();

export const ConfigProvider = (props) => {
	const [configs, setConfigs] = useState({ userMailId: "" });
	/**
	 * Try to load the configs for the first time from local storage
	 */
	useEffect(() => {
		const stateFromLocalStorage = localStorage.getItem(Constants.LOCALSTORAGE_CONFIG_KEY);
		if (stateFromLocalStorage) {
			setConfigs(JSON.parse(stateFromLocalStorage));
		}
	}, []);

	/**
	 * Every time the config changes, store it to local storage
	 */
	useEffect(() => {
		localStorage.setItem(Constants.LOCALSTORAGE_CONFIG_KEY, JSON.stringify(configs));
	}, [configs]);

	return <ConfigContext.Provider value={[configs, setConfigs]}>{props.children}</ConfigContext.Provider>;
};

// Initialize the firebase app
if (!firebase.apps.length) {
	firebase.initializeApp({
		apiKey: "AIzaSyArqWXJZLZaw7WgWfKjangejIpOptcv6lk",
		authDomain: "middleman-e3e91.firebaseapp.com",
		databaseURL: "https://middleman-e3e91-default-rtdb.asia-southeast1.firebasedatabase.app",
		projectId: "middleman-e3e91",
		storageBucket: "middleman-e3e91.appspot.com",
		messagingSenderId: "755724474676",
		appId: "1:755724474676:web:541ed5a70384e5179dad61",
		measurementId: "G-B0D97MQ495",
	});
} else {
	firebase.app();
}

// Initialize Analytics
firebase.analytics();
