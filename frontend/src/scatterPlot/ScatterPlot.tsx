import React, {ReactElement, useEffect, useMemo, useRef, useState} from "react";
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

const IMAGES = "http://127.0.0.1:8080/images/";
export type DataRow = {
  [key: string]: number | string;
  image: string,
  X: number,
  Y: number,
}
export default function ScatterPlot(props: Props): ReactElement {
  const {
    styleSettings,
    dots,
    images
  } = usePlotContext();

  const [info, setInfo] = useState<DataRow | undefined>(undefined);
  const svgRef = useRef(null);
  const ref = useRef<PlotBuilder>(new PlotBuilder());
  useEffect(() => {
    ref.current.on("show-info", (d) => setInfo(d));
    // ref.current.on("jide-info", () => setInfo(undefined));
  }, [ref]);

  const data: DataRow[] = useMemo(() => {
    const pointsWithImages = dots?.map(([x,y], i) => {
      return (images && {
          image: images[i],
          X: x,
          Y: y,
        }
      );
    }) || [];
    return pointsWithImages.filter(f => f) as DataRow[];
  }, [dots, images]);

  console.log(data);

  const updateDotsData = (data: DataRow[] | undefined) => {
    if (data) {
      ref.current.updateDots(data);
    }
  }

  useEffect(throttle(() => updateDotsData(data), 2000), [data, styleSettings]);

  useEffect(() => {
    ref.current.init(svgRef, defaultOptions);
    ref.current.updateScales([-100, 100], [-100, 100]
      // tsneParams.pointsRange.x,
      // tsneParams.pointsRange.y,
    );
  }, []);

  useEffect(() => {
    if (data) {
      ref.current.updateStyle(styleSettings);
      ref.current.updateDots(data);
    }
  }, [styleSettings]);

  // useEffect(() => {
  //   if (preprocessedDfMetadata) {
  //     ref.current.updateMetadata(preprocessedDfMetadata);
  //   }
  // }, [preprocessedDfMetadata]);

  return <>
    {info && <div style={{
      color: "#69b3a2",
      position: "fixed",
      // pointerEvents: "none",
      width: "20rem",
      overflow: "hidden"
    }}>
      <a href={IMAGES + info.image}>link</a>
      {Object.entries(info).map(([key, value]) => {
        return <div>
          {key}: {JSON.stringify(value)}
        </div>
      })}
      <img src={IMAGES + info.image} width="300" height="300"/>
    </div>}
    <svg ref={svgRef} height={"100%"} />
    </>;
}
