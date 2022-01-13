import React, { ReactElement, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
// @ts-ignore
import tSneData from '../data/cars_tsne.csv';
import PlotBuilder from "./PlotBuilder";
import "./ScatterPlot.css";
import { usePlotContext } from "../contexts/PlotContext";
import { throttle } from "../helpers/throttle";

interface Props {}

const defaultOptions = {
  width: 600,
  height: 400,
  // background: "#d3d3d3",
  margin: { top: 10, left: 30, bottom: 10, right: 10 },
};

export type DataRow = {
  [key: string]: number | string;
  X: number,
  Y: number,
}
export default function ScatterPlot(props: Props): ReactElement {
  const svgRef = useRef(null);
  const [data, setData] = useState<DataRow[]>();
  const {
    styleSettings,
    setStyleSettings,
    originalDfJson,
    tsneStepResult
  } = usePlotContext();

	const updateCarData = () => {
		const { points } = tsneStepResult;

		const pointsWithCarInfo: DataRow[] = points.map((point) => {
			const { rowId, xCoord, yCoord } = point;
			const carInfo = originalDfJson ? originalDfJson[rowId] : undefined;

			return (
				carInfo && {
					...carInfo,
					X: xCoord,
					Y: yCoord,
				}
			);
		}).filter(f => f);
		setData(pointsWithCarInfo);
	}

    useEffect(throttle(() => updateCarData(), 500), [tsneStepResult]);

    const ref = useRef<PlotBuilder>(new PlotBuilder());

    useEffect(() => {
      setStyleSettings({
        colorField: 'mark',
        sizeField: 'availabilitycount',
        nameField: "model",
        opacity: 0.3
      });
      ref.current.init(svgRef, defaultOptions);
    	ref.current.updateScales([-25, 20], [-20, 20]);
      // ref.current.setUpAxis();
    }, []);

    useEffect(() => {
      if (data) {
      	ref.current.styleM.setSettings(styleSettings);
        ref.current.updateDots(data);
      }
    }, [data, styleSettings]);

    return <svg ref={svgRef} height={"100%"}/>;
}
