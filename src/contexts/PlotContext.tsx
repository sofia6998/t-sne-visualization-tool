import React, { useContext } from "react";
import { DataFrame, fromCSV, IDataFrame, IFieldRecord } from "data-forge";
import {
  getOriginalDf,
  dropDefaultColumns,
  dropEmptyColumns,
  encodeStringValues,
  replaceEmptyValues,
  dfToArray,
} from "../preprocessing";
import {
  IRowMetadata,
  getDfMetadata
} from "../dfMetadata/getDfMetadata";
import {
  ITsneParams,
  IDataRow,
  ITsneStepResult,
} from "../tsneWrapper/TsneWrapper";
import { StyleSettings } from "../helpers/types";
// eslint-disable-next-line import/no-webpack-loader-syntax
import TsneWorker from 'worker-loader!../runTsne.worker';

export enum PreprocessingStatus {
  NOT_PARSED,
  REMOVING_DEFAULT_COLUMNS,
  REMOVING_EMPTY_COLUMNS,
  ENCODING_STRING_VALUES,
  REPLACE_EMPTY_VALUES,
  COMPLETED,
}

export interface PreprocessingState {
  status: PreprocessingStatus,
  preprocessedDf: IDataFrame<number, IFieldRecord> | null,
}

interface PreprocessingStep {
  func: (df: IDataFrame<number, IFieldRecord>) => IDataFrame<number, IFieldRecord>,
  statusToChange: PreprocessingStatus,
}

interface PlotState {
  csvFile: File | null;
  originalDf: IDataFrame<number, IFieldRecord> | null,
  originalDfJson: any[] | null,
  preprocessingState: PreprocessingState,
  preprocessedDfColumns: string[] | null,
  preprocessedDfMetadata: IRowMetadata[] | null,
  tsneParams: ITsneParams,
  tsneStepResult: ITsneStepResult,
  styleSettings: StyleSettings,
}

interface PlotFuncs {
  setCsvFile: (file: File | null) => void;
  setStyleSettings: (style: StyleSettings) => void;
  setTsneParams: (newTsneParams: ITsneParams) => void;
}

type IPlotContext = PlotState & PlotFuncs;

const PREPROCESSING_PIPELINE: PreprocessingStep[] = [
  { func: getOriginalDf, statusToChange: PreprocessingStatus.REMOVING_DEFAULT_COLUMNS },
  { func: dropDefaultColumns, statusToChange: PreprocessingStatus.REMOVING_EMPTY_COLUMNS },
  { func: dropEmptyColumns, statusToChange: PreprocessingStatus.ENCODING_STRING_VALUES },
  { func: encodeStringValues, statusToChange: PreprocessingStatus.REPLACE_EMPTY_VALUES },
  { func: replaceEmptyValues, statusToChange: PreprocessingStatus.COMPLETED },
];

const PlotContext = React.createContext<IPlotContext | any>(null);
export const usePlotContext = (): IPlotContext =>
  useContext<IPlotContext>(PlotContext);

export default class PlotContextContainer extends React.Component<
  any,
  PlotState
> {
  private readonly funcs: PlotFuncs;
  private tsneWorker: TsneWorker = new TsneWorker();

  constructor(props: Readonly<{}>) {
    super(props);

    this.state = {
      csvFile: null,
      originalDf: null,
      originalDfJson: null,
      preprocessingState: {
        status: PreprocessingStatus.NOT_PARSED,
        preprocessedDf: null,
      },
      preprocessedDfColumns: null,
      preprocessedDfMetadata: null,
      tsneParams: {
        epsilon: 10,
        perplexity: 30,
        numSteps: 500,
        costThreshold: 11,
        pointsRange: {
          x: [-1, 1],
          y: [-1, 1],
        },
      },
      tsneStepResult: {
        currentStep: 0,
        currentCost: 0,
        points: [],
      },
      styleSettings: {} as StyleSettings,
    };

    this.funcs = {
      setCsvFile: this.setCsvFile,
      setStyleSettings: this.setStyleSettings,
      setTsneParams: this.setTsneParams,
    };
  }

  componentDidMount() {
    this.initTsneWorker();
  }

  initTsneWorker() {
    const onTsneStepCompleted = (stepResult: ITsneStepResult): void => {
      this.setState({ tsneStepResult: stepResult });
    }

    this.tsneWorker.onmessage = function (event: MessageEvent<any>) {
      const stepResult = event.data.result as ITsneStepResult;
      onTsneStepCompleted(stepResult);
    }
  }

  setStyleSettings = (styleSettings: StyleSettings) => {
    this.setState({ styleSettings });
  }

  setCsvFile = (file: File | null) => {
    this.setState({ csvFile: file }, this.fileToDataFrame);
  }

  setTsneParams = (newTsneParams: ITsneParams): void => {
    this.setState(
      { tsneParams: newTsneParams },
      () => {
        this.tsneWorker.terminate();

        this.tsneWorker = new TsneWorker();
        this.initTsneWorker();
        this.runTsneSteps();
      }
    );
  }

  fileToDataFrame = async (): Promise<void> => {
    if (this.state.csvFile === null) {
      return;
    }

    const csvFileText: string | undefined = await this.state.csvFile?.text();
    if (csvFileText === undefined) {
      console.log('Error: No text from CSV file');
      return;
    }

    const df: DataFrame<number, any> = fromCSV(csvFileText, { dynamicTyping: true });

    this.setState(
      {
        // TODO: for short demo
        originalDf: (df.endAt(2000) as DataFrame<number, any>),
        originalDfJson: df.endAt(2000).toArray(),
        // TODO: for full presentation
        // originalDf: df,
        // originalDfJson: df.toArray(),
      },
      this.preprocessDataFrame
    );
  }

  preprocessDataFrame = (): void => {
    if (this.state.originalDf === null) {
      return;
    }

    const { originalDf } = this.state;
    let preprocessedDf: IDataFrame<number, IFieldRecord> = originalDf;
    PREPROCESSING_PIPELINE.forEach((step: PreprocessingStep, index: number) => {
      const { func, statusToChange } = step;

      preprocessedDf = func(preprocessedDf);

      const cbFunc = (index === PREPROCESSING_PIPELINE.length - 1)
        ? this.runTsneSteps
        : () => {};

      this.setState(
        { preprocessingState: { status: statusToChange, preprocessedDf }},
        cbFunc
      );
    });
  }

  runTsneSteps = (): void => {
    const { status, preprocessedDf } = this.state.preprocessingState;
    if (status !== PreprocessingStatus.COMPLETED || !preprocessedDf) {
      return;
    }

    this.setState({
      preprocessedDfColumns: preprocessedDf.getColumnNames(),
      preprocessedDfMetadata: getDfMetadata(preprocessedDf)
    });

    const dfData: IDataRow[] = dfToArray(preprocessedDf);
    const xData: number[] = Array.from(Array(dfData.length).keys());

    this.tsneWorker.postMessage({
      params: this.state.tsneParams,
      xData,
      dfData,
    });
  }

  render(): React.ReactNode {
    return (
      <PlotContext.Provider value={{ ...this.state, ...this.funcs }}>
        {this.props.children}
      </PlotContext.Provider>
    );
  }
}
