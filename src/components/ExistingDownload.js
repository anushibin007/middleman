import React from "react";
import { useEffect, useState } from "react";
import { Button, ProgressBar } from "react-bootstrap";
import { toast } from "react-toastify";
import DownloadService from "../services/DownloadService";

const ExistingDownload = (props) => {
	const [existingDownload, setExistingDownload] = useState([]);

	useEffect(() => {
		setExistingDownload(props.item);
	}, [props.item]);

	const getRowColorClassName = () => {
		if (existingDownload.status === "done") return "table-success";
		if (existingDownload.status === "in progress") return "table-warning";
		if (existingDownload.status === "error") return "table-danger";
	};

	const getButtonsDisabledStatus = () => {
		if (existingDownload.status === "done" || existingDownload.status === "error") return false;
		return true;
	};

	const downloadFileFromMiddleman = () => {
		window.open(existingDownload.middlemanUrl);
	};

	const deleteFileFromMiddleman = () => {
		DownloadService.deleteFile(existingDownload.id);
	};

	const getExistingDownloadUrl = () => {
		if (existingDownload.status === "error") {
			return existingDownload.downloadUrl;
		} else {
			return <a href={existingDownload.downloadUrl}>{existingDownload.downloadUrl}</a>;
		}
	};

	const retryDownload = () => {
		toast("🚀 Still under Development. Stay Tuned!");
	};

	const getFileSize = () => {
		if (existingDownload.size) {
			const size = Math.round((existingDownload.size / 1024 / 1024) * 100) / 100;
			return size;
		}
	};

	const getDownloadLink = () => {
		if (existingDownload.publicUrl) {
			return <a href={existingDownload.publicUrl}>Download</a>;
		} else {
			return "⏳";
		}
	};

	return (
		<tr>
			<td>
				<a href={existingDownload.fileUrl}>{existingDownload.fileName}</a>
			</td>
			<td>{getFileSize()}</td>
			<td>{getDownloadLink()}</td>
			<td>
				{existingDownload.progress}
				<ProgressBar now={existingDownload.progress} animated></ProgressBar>
			</td>
			<td>
				{new Date(existingDownload.createdAt).toDateString()}
				<br />
				{new Date(existingDownload.createdAt).toLocaleTimeString()}
			</td>
		</tr>
	);
};

export default ExistingDownload;
