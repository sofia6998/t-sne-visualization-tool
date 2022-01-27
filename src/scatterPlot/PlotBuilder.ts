import { RefObject } from "react";
import { Selection } from "d3";
import * as d3 from "d3";
import { DataRow } from "./ScatterPlot";
import { scaledLine, StyleManager } from "./plotHelpers";
import { StyleSettings } from "../helpers/types";
import { IRowMetadata } from "../dfMetadata/getDfMetadata";
import { EventEmitter } from "events";


const DOT_CLASS = "dot";
type Options = {
  width: number;
  height: number;
  background?: string;
  stroke?: string;
  margin?: { top: number; left: number; bottom: number; right: number };
};

const defaultMargin = { top: 0, left: 0, bottom: 0, right: 0 };

export default class PlotBuilder extends EventEmitter {
  private styleM = new StyleManager();
  private svg: Selection<Element, any, HTMLElement, any> | undefined;
  private mainG: Selection<SVGGElement, any, HTMLElement, any> | undefined;
  private xScale = d3.scaleLinear();
  private yScale = d3.scaleLinear();
  private lineFunction = d3.line();
  private margin = defaultMargin;
  private height = 0;
  private width = 0;

  updateStyle(styleSettings: StyleSettings) {
    this.styleM.setSettings(styleSettings);
    this.setupZooming();
  }

  updateMetadata(dfMetadata: IRowMetadata[]) {
    this.styleM.setDfMetadata(dfMetadata);
  }

  init(ref: RefObject<any>, options: Options): void {
    this.svg = d3.select<Element, any>(ref.current);
    this.mainG = this.svg.append('g');
    this.svg.style("background", options.background || "transparent");
    this.svg.attr("height", "auto");
    this.svg.attr("width", "100%");
    this.svg.attr("viewBox", `0 0 ${options.width} ${options.height}`);
    this.margin = options.margin || defaultMargin;
    this.width = options.width - this.margin.left - this.margin.right;
    this.height = options.height - this.margin.top - this.margin.bottom;

    this.setupZooming();
  }

  setupZooming() {
    const zoom = d3.zoom().on("zoom", e => {
      d3.select('svg g').attr("transform", (e.transform));
      this.svg?.style("stroke-width", 3 / Math.sqrt(e.transform.k));
      this.svg?.selectAll("circle").attr("r", (d) => this.styleM.getPointRadius(d) / Math.sqrt(e.transform.k));
      this.svg?.selectAll(`.${DOT_CLASS} text`).style("font-size", 5 / Math.sqrt(e.transform.k));
    });

    this.svg?.call(zoom);
  }

  updateScales(xRange: [number, number], yRange: [number, number]): void {
    this.xScale = d3
      .scaleLinear()
      .domain([xRange[0], xRange[1]])
      .range([this.margin.left, this.width]);
    this.yScale = d3
      .scaleLinear()
      .domain([yRange[0], yRange[1]])
      .range([this.height, this.margin.bottom]);
    this.lineFunction = scaledLine(this.xScale, this.yScale);
  }

  remove(selector: string): void {
    this.svg?.selectAll(selector).remove();
  }

  updateDots(
    data: Array<DataRow>,
  ): void {
    this.remove("." + DOT_CLASS);
    const gDots = this.mainG?.selectAll(DOT_CLASS)
      .data(data)
      .enter()
      .append('g')
      .attr("class", DOT_CLASS);
    gDots?.append("circle")
      .attr("cx", (d) => {
        return this.xScale(d.X)
      }).on("mouseover", this.handleMouseOver)
        .on("mouseout", this.handleMouseOut)
      .attr("cy", (d) => { return this.yScale(d.Y) })
      .attr("r", this.styleM.getPointRadius)
      .style("opacity", this.styleM.getPointOpacity)
      .style("fill", this.styleM.getPointColor);
  }

  setUpAxis(): void {
    if (!this.mainG) {
      return;
    }
    const xAxis = this.mainG
      .append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .attr("class", "axis axis--x")
      .call(d3.axisBottom(this.xScale))
      .style("color", "transparent");

    xAxis.selectAll("text").style("fill", "#59536B");

    const yAxis = this.mainG
      .append("g")
      .attr("transform", "translate(" + this.margin.left + ", 0)")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(this.yScale))
      .style("color", "transparent");

    yAxis.selectAll("text").style("fill", "#59536B");
  }

  handleMouseOver = (e:any, d: any) => {
    this.emit("show-info", d);
  }

  handleMouseOut = (d: any) => {
    this.emit("hide-info");
  }
}
