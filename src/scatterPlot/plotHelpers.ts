import * as d3 from "d3";
import { ScaleLinear } from "d3-scale";
import { Line } from "d3";
import { DataRow } from "./ScatterPlot";
import { StyleSettings } from "../helpers/types";
import { IRowMetadata } from "../dfMetadata/getDfMetadata";
import { isEmptyValue } from "../preprocessing/isEmptyValue";

export const DEFAULT_FRAME: Frame = {
  margin: { top: 10, right: 30, bottom: 30, left: 60 },
  width: 460 - 60 - 30,
  height: 400 - 10 - 30
}

export type Frame = {
  width: number;
  height: number;
  margin: { top: number, right: number, bottom: number, left: number },
}

export default function formatDataToDots(data: Array<DataRow>): Array<[number, number]> {
  return data.map(d => [d.X, d.Y]);
}

export function scaledLine(
  xScale: ScaleLinear<any, any>,
  yScale: ScaleLinear<any, any>
): Line<any> {
  return d3
    .line()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]))
    .curve(d3.curveMonotoneX);
}

export function* colorGenerator(): Generator<string, string, number> {
  let deg = 0;
  let step = 360;
  // @ts-ignore
  let value = yield null;
  yield getColorByHue(value || deg);
  let i = 0;
  while (true) {
    i++;
    deg += step;
    if (deg >= 360) {
      step = step / 2;
      deg = step / 2;
    }
    // @ts-ignore
    let value = yield null;
    yield getColorByHue(value || deg);
  }
}

export function getColorByHue(hue: number): string {
  return `hsl(${hue}, 70%, 60%)`;
}

export function getRandomColor(): string {
  return `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
}

export class ColorManager {
  private gen: Generator<string, string, number>;
  private map: { [key: string | number]: string };
  constructor() {
    this.gen = colorGenerator();
    this.map = {};
  }

  getColor(value: string | number) {
    if (!this.map[value]) {
      if (parseInt(value + "") !== NaN) {
        this.map[value] = this.gen.next(parseInt(value + "")).value;
      } else {
        this.map[value] = this.gen.next().value;
      }
    }
    return this.map[value];
  }

  reset() {
    this.map = {};
    this.gen = colorGenerator();
  }
}

export class StyleManager {
  private static COLOR_SCALED_RANGE: [number, number] = [90, 270];
  private static SIZE_SCALED_RANGE: [number, number] = [1, 10];

  private colorManager = new ColorManager();
  private styleSettings: StyleSettings = {};
  private dfMetadata: IRowMetadata[] = [];

  constructor() {
    this.styleSettings = {};
  }

  private getScaledValue = (
    type: 'color' | 'size',
    field: string | undefined,
    value: any
  ): any => {
    if (!field || isEmptyValue(value) || typeof value === 'string') {
      return value;
    }

    const foundMetadata: IRowMetadata | undefined = this.dfMetadata.find(
      (rowMetadata: IRowMetadata) => (rowMetadata.columnName === field),
    );
    if (foundMetadata === undefined) {
      return value;
    }

    const minV: number = foundMetadata.minValue;
    const maxV: number = foundMetadata.maxValue;

    let scaledMinV: number = 0;
    let scaledMaxV: number = 1;

    switch (type) {
      case 'color':
        scaledMinV = StyleManager.COLOR_SCALED_RANGE[0];
        scaledMaxV = StyleManager.COLOR_SCALED_RANGE[1];
        break;
      case 'size':
        scaledMinV = StyleManager.SIZE_SCALED_RANGE[0];
        scaledMaxV = StyleManager.SIZE_SCALED_RANGE[1];
        break;
      default:
        break;
    };

    return ((value - minV) / (maxV - minV)) * (scaledMaxV - scaledMinV) + scaledMinV;
  }

  setSettings = (styleSettings: StyleSettings) => {
    this.styleSettings = styleSettings || {};
    this.colorManager.reset();
  }

  setDfMetadata = (dfMetadata: IRowMetadata[]) => {
    this.dfMetadata = dfMetadata;
  }

  getPointRadius = (d: any) => {
    const { sizeField } = this.styleSettings;
    return (
      // @ts-ignore
      this.getScaledValue('size', sizeField, d[sizeField]) || 1.51
    );
  }

  getPointText = (d: any) => {
    const { nameField } = this.styleSettings;
    // @ts-ignore
    return d[nameField];
  }

  getPointColor = (d: any) => {
    const { colorField } = this.styleSettings;
    // @ts-ignore
    const scaledV: any = this.getScaledValue('color', colorField, d[colorField]);

    return this.colorManager.getColor(scaledV);
  }

  getPointOpacity = (d: any) => {
    const { opacity } = this.styleSettings;
    // @ts-ignore
    return opacity || 1;
  }

  reset = () => {
    this.colorManager.reset();
  }
}
