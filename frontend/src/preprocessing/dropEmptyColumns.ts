import { IDataFrame, IFieldRecord } from "data-forge";
import { isEmptyValue } from "./isEmptyValue";

export function dropEmptyColumns(df: IDataFrame<number, IFieldRecord>): IDataFrame<number, IFieldRecord> {
  const columnNames: string[] = df.getColumnNames();
  const jsonDf: any[] = JSON.parse(df.toJSON());

  const emptyColumnNames: string[] = [];
  columnNames.forEach((cName: string) => {
    const isColumnEmpty: boolean = jsonDf.every((row: any) => isEmptyValue(row[cName]));

    if (isColumnEmpty) {
      emptyColumnNames.push(cName);
    }
  });

  return df.dropSeries(emptyColumnNames);
}