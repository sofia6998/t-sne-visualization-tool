import * as tsneJs from "../lib/tsne";

export interface IPointsRange {
  x: [number, number],
  y: [number, number],
};

export interface ITsneParams {
  epsilon: number,
  perplexity: number,
  numSteps: number,
  costThreshold: number,
  pointsRange: IPointsRange
};

export type IDataRow = number[];

export interface ITsneResultRow {
  rowId: number,
  xCoord: number,
  yCoord: number,
}

export interface ITsneStepResult {
  currentStep: number,
  currentCost: number,
  points: ITsneResultRow[],
}

export class TsneWrapper {
  private tsne: any = null;

  private numSteps: number = 0;
  private costThreshold: number = 0;
  private pointsRange: IPointsRange;

  private currentStep: number = 0;
  private currentCost: number = Number.MAX_VALUE;
  private currentY: IDataRow[] = [];

  private xData: number[] = [];

  constructor(params: ITsneParams, xData: number[]) {
    this.tsne = new tsneJs.tSNE({
      epsilon: params.epsilon,
      perplexity: params.perplexity,
    });

    this.numSteps = params.numSteps;
    this.costThreshold = params.costThreshold;
    this.pointsRange = params.pointsRange;

    this.xData = xData;
  }

  private normalizePoints(points: IDataRow[]): IDataRow[] {
    const xPoints: number[] = [];
    const yPoints: number[] = [];

    points.forEach((point: number[]) => {
      xPoints.push(point[0]);
      yPoints.push(point[1]);
    });

    const minX: number = Math.min.apply(null, xPoints);
    const maxX: number = Math.max.apply(null, xPoints);
    const minY: number = Math.min.apply(null, yPoints);
    const maxY: number = Math.max.apply(null, yPoints);

    const { x: xRanges, y: yRanges } = this.pointsRange;

    return points.map((point: number[]) => {
      const normX: number = (xRanges[1] - xRanges[0]) * ((point[0] - minX) / (maxX - minX)) + xRanges[0];
      const normY: number = (yRanges[1] - yRanges[0]) * ((point[1] - minY) / (maxY - minY)) + yRanges[0];

      return [normX, normY];
    });
  }

  private getStepResult(): ITsneStepResult {
    if (!this.currentY.length) {
      return {
        currentStep: this.currentStep,
        currentCost: this.currentCost,
        points: [],
      };
    }

    const points: ITsneResultRow[] = [];
    for (let i = 0; i < this.currentY.length; i++) {
      points.push({
        rowId: this.xData[i],
        xCoord: (this.currentY[i][0] as number),
        yCoord: (this.currentY[i][1] as number),
      });
    }

    return {
      currentStep: this.currentStep,
      currentCost: this.currentCost,
      points,
    };
  }

  private isIterationsEnded(): boolean {
    return (
      this.currentStep >= this.numSteps ||
      this.currentCost <= this.costThreshold
    );
  }

  public initTsne(data: IDataRow[]): ITsneStepResult {
    this.tsne.initDataRaw(data);
    this.currentY = this.normalizePoints(this.tsne.Y);
    return this.getStepResult();
  }

  public runStep(): ITsneStepResult {
    if (this.isIterationsEnded()) {
      return this.getStepResult();
    }

    this.currentStep += 1;
    this.currentCost = this.tsne.step();
    this.currentY = this.normalizePoints(this.tsne.Y);

    return this.getStepResult();
  }
}
