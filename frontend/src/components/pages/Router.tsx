import * as React from "react";
import {useEffect} from "react";
import {Route, Routes, useNavigate, useLocation, HashRouter} from "react-router-dom";
import TsneGraphView from "./TsneGraphView";
import UploadCsvPage from "./UploadCsvPage";
import {PreprocessingStatus, usePlotContext} from "../../contexts/PlotContext";

export const UPLOAD_CSV = "upload_csv";
export const GRAPH_VIEW = "graph";

export const Router = (): React.ReactElement => {
	return (
		<HashRouter>
			<PagePicker />
		</HashRouter>
	);
};

function PagePicker() {
	const {dots} = usePlotContext();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (dots) {
			navigate(GRAPH_VIEW);
		} else if (location.pathname.includes(GRAPH_VIEW)) {
			navigate('/');
		}
	}, [dots]);
	return (
		<Routes>
			<Route path={GRAPH_VIEW + "/*"} element={<TsneGraphView />} />
			<Route path="/" element={<UploadCsvPage />} />
		</Routes>
	);
}
