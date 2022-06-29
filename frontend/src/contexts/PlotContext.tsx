import React, { useContext } from "react";
import { IDataFrame, IFieldRecord } from "data-forge";
import { StyleSettings } from "../helpers/types";
import * as Papa from "papaparse";
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

interface PlotState {
  dots?: Array<[x: number,y: number]>,
  images?: Array<string>
  styleSettings: StyleSettings,
}

interface PlotFuncs {
  loadData: (imagesMapUrl: string, dotsUrl: string) => void;
  setStyleSettings: (style: StyleSettings) => void;
}

type IPlotContext = PlotState & PlotFuncs;

const PlotContext = React.createContext<IPlotContext | any>(null);
export const usePlotContext = (): IPlotContext =>
  useContext<IPlotContext>(PlotContext);

export default class PlotContextContainer extends React.Component<
  any,
  PlotState
> {
  private readonly funcs: PlotFuncs;

  constructor(props: Readonly<{}>) {
    super(props);

    this.state = {
      styleSettings: {} as StyleSettings,
    };

    this.funcs = {
      loadData: this.loadData,
      setStyleSettings: this.setStyleSettings,
    };
  }

  setStyleSettings = (styleSettings: StyleSettings) => {
    this.setState({ styleSettings });
  }

  loadData = (imagesMapUrl: string, dotsUrl: string) => {
    console.log(imagesMapUrl);
    fetch(imagesMapUrl)
        .then(res => res.text())
        .then(v => Papa.parse<[string, string]>(v))
        .then(data => {
          const images = data.data.map(el => el[1]);
          this.setState({images});
        });
    fetch(dotsUrl)
        .then(res => res.text())
        .then(v => Papa.parse<[string, string]>(v))
        .then(data => {
          const dots = data.data.map(([x, y]) => ([parseFloat(x), parseFloat(y)] as [x: number,y: number]));
          this.setState({dots});
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
