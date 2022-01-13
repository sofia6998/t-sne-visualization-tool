import { IDataFrame, IFieldRecord } from "data-forge";

const DEFAULT_COLUMNS_TO_DROP: string[] = ["id"];

export function dropDefaultColumns(df: IDataFrame<number, IFieldRecord>): IDataFrame<number, IFieldRecord> {
	return df.dropSeries(DEFAULT_COLUMNS_TO_DROP);
}