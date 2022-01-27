import * as React from "react";
import {useEffect} from "react";
import {BrowserRouter, Navigate, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import TsneGraphView from "./TsneGraphView";
import UploadCsvPage from "./UploadCsvPage";
import {PreprocessingStatus, usePlotContext} from "../../contexts/PlotContext";

export const UPLOAD_CSV = "upload_csv";
export const GRAPH_VIEW = "graph";

export const Router = (): React.ReactElement => {
	return (
		<BrowserRouter>
			<PagePicker />
		</BrowserRouter>
	);
};

function PagePicker() {
	const {preprocessingState} = usePlotContext();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (preprocessingState.status === PreprocessingStatus.COMPLETED) {
			navigate(GRAPH_VIEW);
		} else if (location.pathname.includes(GRAPH_VIEW)) {
			navigate(UPLOAD_CSV);
		}
	}, [preprocessingState]);
	return (
		<Routes>
			<Route path={UPLOAD_CSV} element={<UploadCsvPage />} />
			<Route path={GRAPH_VIEW + "/*"} element={<TsneGraphView />} />
			<Route path="/" element={<Navigate to={UPLOAD_CSV} />} />
		</Routes>
	);
}
