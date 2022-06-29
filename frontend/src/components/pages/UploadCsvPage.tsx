import React from "react";
import { usePlotContext } from "../../contexts/PlotContext";
import Layout from "../Layout";
import styles from "./UploadCsvPage.module.scss";


const STATIC_SERVER = "http://127.0.0.1:8080/";

type DataEnry = {
	name: string,
	imageMap: string,
	dots: string,
}

type MapFunc = (key: string, nums?: Array<number>, prefix?: string) => Array<DataEnry>;
const UploadCsvPage: React.FC = () => {

	const fullMap: MapFunc = (key, nums = [82, 94, 106], prefix = "") => {
		return nums.map((num) => ({
			name: prefix + key + num,
			imageMap: key + "_images.csv",
			dots: prefix + key + num + "_dots.csv"
		}));
	}
	const animals: Array<DataEnry> = [
		// ...fullMap("poems"),
		// ...fullMap("ideal"),
		...fullMap("animal"),
		...fullMap("animal", [6, 10, 14, 16, 17], "vgg_"),
		...fullMap("animal", [6, 10, 20, 30, 40, 45, 50, 60], "r_"),
	];

	const patternNet: Array<DataEnry> = [
		...fullMap("patternNet", [70, 81]),
		...fullMap("patternNet", [5, 10, 20, 30, 40, 45, 49, 50], "r_"),
		...fullMap("patternNet", [16, 17], "vgg_"),
		...fullMap("patternNet", [10, 13, 16, 17], "vgg_"),
	];

	const digits: Array<DataEnry> = [
		...fullMap("digits", [44, 53, 63, 75, 81]),
		...fullMap("digits", [10, 13, 16, 17], "vgg_"),
		...fullMap("digits", [6, 10, 20, 30, 40, 45, 50, 60], "r_"),
	];

	return (
		<Layout>
			<div className={styles.container}>
			<div className={styles.column}>
				{animals.map(LoadButton)}
			</div>
			<div className={styles.column}>
				{patternNet.map(LoadButton)}
			</div>
				<div className={styles.column}>
					{digits.map(LoadButton)}
				</div>
			</div>
		</Layout>
	);
}

function LoadButton(entry: DataEnry) {
	const { loadData } = usePlotContext();
	return (
		<button
			className={styles.csvButton}
			onClick={() => loadData(STATIC_SERVER + entry.imageMap, STATIC_SERVER + entry.dots)}
		>
			{entry.name}
		</button>
	);
}
export default UploadCsvPage;
