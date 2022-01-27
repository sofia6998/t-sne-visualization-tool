import { IDataFrame, IFieldRecord } from "data-forge";
import { IDataRow } from "../tsneWrapper/TsneWrapper";

export interface IRowMetadata {
  columnName: string;
  minValue: number;
  maxValue: number;
}

export function getDfMetadata(df: IDataFrame<number, IFieldRecord>): IRowMetadata[] {
  const rowsMetadata: IRowMetadata[] = [];

  const columns = df.getColumns();
  console.log('columns:', columns); // TODO: log

  return rowsMetadata;
} 