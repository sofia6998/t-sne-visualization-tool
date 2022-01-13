import * as tsneJs from "../lib/tsne";

export interface ITsneParams {
	epsilon: number,
	perplexity: number,
	numSteps: number,
	costThreshold: number,
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

		this.xData = xData;
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
		this.currentY = this.tsne.Y;
		return this.getStepResult();
	}

	public runStep(): ITsneStepResult {
		if (this.isIterationsEnded()) {
			return this.getStepResult();
		}

		this.currentStep += 1;
		this.currentCost = this.tsne.step();
		this.currentY = this.tsne.Y;

		return this.getStepResult();
	}
}
