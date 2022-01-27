import React, { ChangeEvent, useEffect } from "react";
import { usePlotContext } from "../../contexts/PlotContext";
import Layout from "../Layout";
import styles from "./UploadCsvPage.module.scss";
import Slider from "../common/Slider";

const UploadCsvPage: React.FC = () => {
	let fileInputRef: HTMLInputElement | null = null;

	const { setCsvFile } = usePlotContext();

	const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setCsvFile(e.target.files[0]);
		}
	}

	return (
		<Layout>
			<div className={styles.container}>
				<input
					ref={(ref) => (fileInputRef = ref)}
					type="file"
					hidden
					accept=".csv"
					onChange={handleFiles}
				/>
				<button
					className={styles.csvButton}
					onClick={() => fileInputRef?.click()}
				>
					Upload CSV
				</button>
			</div>
		</Layout>
	);
}

export default UploadCsvPage;
