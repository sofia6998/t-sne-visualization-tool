import React from "react";
import ScatterPlot from "../../scatterPlot/ScatterPlot";
import Layout from "../Layout";
import SettingsOverlayModule from "../SettingsOverlayModule";

const TsneGraphView: React.FC = () => {
	return (
		<Layout>
			<ScatterPlot />
			<SettingsOverlayModule />
		</Layout>
	);
}

export default TsneGraphView;
