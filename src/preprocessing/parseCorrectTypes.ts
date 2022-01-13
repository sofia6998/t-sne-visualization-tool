import { IDataFrame, IFieldRecord, fromJSON } from "data-forge";

export function parseCorrectTypes(df: IDataFrame<number, IFieldRecord>): IDataFrame<number, IFieldRecord> {
	const columnNames: string[] = df.getColumnNames();
	const jsonDf: any[] = JSON.parse(df.toJSON());
	const jsonDfWithParsedTypes: any[] = [];

	jsonDf.forEach((row: any) => {
		const parsedRow: any = {};

		columnNames.forEach((cName: string) => {
			const parsedValue: number = parseFloat(row[cName]);
			parsedRow[cName] = isNaN(parsedValue) ? row[cName] : parsedValue;
		});

		jsonDfWithParsedTypes.push(parsedRow);
	});

	return fromJSON(JSON.stringify(jsonDfWithParsedTypes));
}