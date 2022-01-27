import React, { ReactElement, useEffect, useRef, useState } from "react";
import PlotBuilder from "./PlotBuilder";
import "./ScatterPlot.css";
import { IDataRow, IPointsRange } from "../tsneWrapper/TsneWrapper";
import { usePlotContext } from "../contexts/PlotContext";
import { throttle } from "../helpers/throttle";

interface Props { }

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
    tsneParams,
    tsneStepResult,
  } = usePlotContext();

  const ref = useRef<PlotBuilder>(new PlotBuilder());

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

  const updateDotsData = (data: DataRow[] | undefined) => {
    if (data) {
      ref.current.updateDots(data);
    }
  }

  useEffect(throttle(() => updateCarData(), 500), [tsneStepResult]);

  useEffect(throttle(() => updateDotsData(data), 2000), [data]);

  useEffect(() => {
    ref.current.init(svgRef, defaultOptions);
    ref.current.updateScales(
      tsneParams.pointsRange.x,
      tsneParams.pointsRange.y,
    );
  }, []);

  useEffect(() => {
    if (data) {
      ref.current.styleM.setSettings(styleSettings);
      ref.current.updateDots(data);
    }
  }, [styleSettings]);

  return <svg ref={svgRef} height={"100%"} />;
}
