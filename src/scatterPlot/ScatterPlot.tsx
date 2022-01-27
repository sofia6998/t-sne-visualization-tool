import React, { ReactElement, useEffect, useRef, useState } from "react";
import PlotBuilder from "./PlotBuilder";
import "./ScatterPlot.css";
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
  const {
    styleSettings,
    originalDfJson,
    tsneParams,
    tsneStepResult,
    preprocessedDfMetadata,
  } = usePlotContext();

  const [info, setInfo] = useState(undefined);
  const svgRef = useRef(null);
  const ref = useRef<PlotBuilder>(new PlotBuilder());
  useEffect(() => {
    ref.current.on("show-info", (d) => setInfo(d));
    // ref.current.on("jide-info", () => setInfo(undefined));
  }, [ref]);

  const [data, setData] = useState<DataRow[]>();

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
      ref.current.updateStyle(styleSettings);
      ref.current.updateDots(data);
    }
  }, [styleSettings]);

  useEffect(() => {
    if (preprocessedDfMetadata) {
      ref.current.updateMetadata(preprocessedDfMetadata);
    }
  }, [preprocessedDfMetadata]);

  return <>
    {info && <div style={{
      color: "#69b3a2",
      position: "fixed",
      pointerEvents: "none",
      width: "20rem",
      overflow: "hidden"
    }}>
      {Object.entries(info).map(([key, value]) => {
        return <div>
          {key}: {JSON.stringify(value)}
        </div>
      })}
    </div>}
    <svg ref={svgRef} height={"100%"} />
    </>;
}
