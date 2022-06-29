import { IDataFrame, IFieldRecord, ISeries } from "data-forge";
import { IColumn } from "data-forge/build/lib/dataframe";

export interface IRowMetadata {
  columnName: string;
  minValue: number;
  maxValue: number;
}

export function getDfMetadata(df: IDataFrame<number, IFieldRecord>): IRowMetadata[] {
  const rowsMetadata: IRowMetadata[] = [];

  const columns: ISeries<number, IColumn> = df.getColumns();
  columns.forEach((column: IColumn) => {
    const arrValues: number[] = column.series.toArray();

    rowsMetadata.push({
      columnName: column.name,
      minValue: Math.min.apply(null, arrValues),
      maxValue: Math.max.apply(null, arrValues),
    } as IRowMetadata);
  });

  return rowsMetadata;
} 