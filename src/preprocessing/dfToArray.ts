import { IDataFrame, IFieldRecord } from "data-forge";
import { IDataRow } from "../tsneWrapper/TsneWrapper";

export function dfToArray(df: IDataFrame<number, IFieldRecord>): IDataRow[] {
	const rows: IFieldRecord[] = df.toArray();
	return rows.map(
		(row: IFieldRecord) => Object.values(row)
	);
}