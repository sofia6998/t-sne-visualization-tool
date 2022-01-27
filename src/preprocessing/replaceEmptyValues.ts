import { IDataFrame, IFieldRecord, fromJSON } from "data-forge";
import { isEmptyValue } from "./isEmptyValue";

const EMPTY_VALUE_TO_REPLACE: number = -1;

export function replaceEmptyValues(df: IDataFrame<number, IFieldRecord>): IDataFrame<number, IFieldRecord> {
  const columnNames: string[] = df.getColumnNames();
  const jsonDf: any[] = JSON.parse(df.toJSON());

  columnNames.forEach((cName: string) => {
    jsonDf.forEach((row: any, index: number) => {
      if (isEmptyValue(row[cName])) {
        jsonDf[index][cName] = EMPTY_VALUE_TO_REPLACE;
      }
    });
  });

  return fromJSON(JSON.stringify(jsonDf));
}
