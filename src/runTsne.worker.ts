import {
  ITsneParams,
  IDataRow,
  ITsneStepResult,
  TsneWrapper,
} from "./tsneWrapper/TsneWrapper";

// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;

ctx.addEventListener('message', (event) => {
  const tsneParams = event.data.params as ITsneParams;
  const xData = event.data.xData as number[];
  const dfData = event.data.dfData as IDataRow[];

  const tsneWrapper = new TsneWrapper(tsneParams, xData);
  const initStepResult: ITsneStepResult = tsneWrapper.initTsne(dfData);
  postMessage({ result: initStepResult });

  if (initStepResult.currentCost <= tsneParams.costThreshold) {
    return;
  }

  for (let i = 0; i < tsneParams.numSteps; i++) {
    const currentStepResult: ITsneStepResult = tsneWrapper.runStep();
    postMessage({ result: currentStepResult });

    if (currentStepResult.currentCost <= tsneParams.costThreshold) {
      break;
    }
  }
});

export {};
