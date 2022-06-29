import { IDataFrame, IFieldRecord, Series } from "data-forge";
import * as jsmlt from '@jsmlt/jsmlt'

export function encodeStringValues(df: IDataFrame<number, IFieldRecord>): IDataFrame<number, IFieldRecord> {
	const dfTypes = df.detectTypes();

	let modifiedDf: IDataFrame<number, IFieldRecord> = df;
	const encoder = new jsmlt.Preprocessing.LabelEncoder();
	dfTypes.forEach((row) => {
		if (row.Type !== 'string') {
			return;
		}

		const columnArray: string[] = df.getSeries(row.Column).toArray();
		const encodedColumn: Series = new Series(encoder.encode(columnArray));
		
		modifiedDf = modifiedDf.dropSeries(row.Column);
		modifiedDf = modifiedDf.withSeries({ [row.Column]: encodedColumn });
	});

	return modifiedDf;
}