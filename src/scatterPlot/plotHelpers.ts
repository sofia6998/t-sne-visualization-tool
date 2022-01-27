import * as d3 from "d3";
import { ScaleLinear } from "d3-scale";
import { Line } from "d3";
import { DataRow } from "./ScatterPlot";
import { StyleSettings } from "../helpers/types";

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
    // const colors = ['#FCE694', "#9CFFFA", "#B7B6C1"];
    let deg = 0;
    let step = 360;
    // @ts-ignore
    let value = yield null;
    yield getColorByHue(deg);
    let i = 0;
    // yield colors[i % 3];
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
        // yield colors[i % 3];
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
    private colorManager = new ColorManager();
    private styleSettings: StyleSettings = {};
    constructor() {
        this.styleSettings = {};
    }

    setSettings = (styleSettings: StyleSettings) => {
        this.styleSettings = styleSettings || {};
        this.colorManager.reset();
    }

    getPointRadius = (d: any) => {
        const { sizeField } = this.styleSettings;
        // @ts-ignore
        return (d[sizeField] || 1.51);
    }

    getPointText = (d: any) => {
        const { nameField } = this.styleSettings;
        // @ts-ignore
        return d[nameField];
    }

    getPointColor = (d: any) => {
        const { colorField } = this.styleSettings;
        // @ts-ignore
        return this.colorManager.getColor(d[colorField]);
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
