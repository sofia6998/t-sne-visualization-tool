import { IDataFrame, IFieldRecord } from "data-forge";

export function getOriginalDf(df: IDataFrame<number, IFieldRecord>): IDataFrame<number, IFieldRecord> {
  return df;
}