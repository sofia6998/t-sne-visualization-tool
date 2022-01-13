import SettinsIcon from "./icons/SettingsIcon";
import styles from "./SettingsOverlayModule.module.scss";
import React, { useState } from "react";
import { classNames } from "../helpers/classNames";
import BlankButton from "./common/BlankButton";
import Slider from "./Slider";
import { usePlotContext } from "../contexts/PlotContext";
import { ITsneParams } from "../tsneWrapper/TsneWrapper";

const SettingsOverlayModule: React.FC = () => {
	const [open, setOpen] = useState<boolean>(false);

	return (
		<>
			<BlankButton
				onClick={() => setOpen(o => !o)}
				title={open ? "close" : "open"}
				className={styles.button}
			>
				<SettinsIcon />
			</BlankButton>
			<div className={classNames(styles.settingsContainer, open && styles.opened)}>
				<TSneParams />
				{/* <StyleParams /> */}
			</div>
		</>

	);
}

const StyleParams: React.FC = () => {
	// TODO: edit component and switch on in SettingsOverlayModule
	const [epsilon, setEpsilon] = useState(0);
	const [perplexity, setPerplexity] = useState(0);
	const [stepsNum, setStepsNum] = useState(0);
	const [costThreshold, setCostThreshold] = useState(0);
	return <>
		<div className={styles.filterTitle}>
			Styling parameters
		</div>
		<div className={styles.paramsGrid}>
			<div className={styles.paramTitle}>Epsilon</div>
			<Slider
				defaultValue={50}
				max={100}
				min={0}
				value={epsilon}
				onChange={setEpsilon}
			/>
			<div className={styles.paramTitle}>Perplexity</div>
			<Slider
				defaultValue={50}
				max={100}
				min={0}
				value={perplexity}
				onChange={setPerplexity}
			/>
			<div className={styles.paramTitle}>Steps number</div>
			<Slider 
				defaultValue={50}
				max={100}
				min={0}
				value={stepsNum}
				onChange={setStepsNum}
			/>
			<div className={styles.paramTitle}>Cost threshold</div>
			<Slider 
				defaultValue={50}
				max={100}
				min={0}
				value={costThreshold}
				onChange={setCostThreshold}
			/>
		</div>
	</>
}

const TSneParams: React.FC = () => {
	const { tsneParams, setTsneParams } = usePlotContext();

	const [epsilon, setEpsilon] = useState(tsneParams.epsilon);
	const [perplexity, setPerplexity] = useState(tsneParams.perplexity);
	const [numSteps, setNumSteps] = useState(tsneParams.numSteps);
	const [costThreshold, setCostThreshold] = useState(tsneParams.costThreshold);

	const handleOnClickRefitButton = () => {
		setTsneParams({
			epsilon,
			perplexity,
			numSteps,
			costThreshold,
		} as ITsneParams);
	}

	return <>
		<div className={styles.filterTitle}>
			T-SNE parameters
		</div>
		<div className={styles.paramsGrid}>
			<div className={styles.paramTitle}>Epsilon</div>
			<Slider
				defaultValue={50}
				max={100}
				min={0}
				value={epsilon}
				onChange={setEpsilon} 
			/>
			<div className={styles.paramTitle}>Perplexity</div>
			<Slider
				defaultValue={50}
				max={100}
				min={0}
				value={perplexity}
				onChange={setPerplexity}
			/>
			<div className={styles.paramTitle}>Steps number</div>
			<Slider
				defaultValue={50}
				max={1000000}
				min={1}
				value={numSteps}
				onChange={setNumSteps}
			/>
			<div className={styles.paramTitle}>Cost threshold</div>
			<Slider
				defaultValue={50}
				max={100}
				min={1}
				value={costThreshold}
				onChange={setCostThreshold}
			/>

			<BlankButton
				className={styles.refitButton}
				onClick={handleOnClickRefitButton}
			>
				Refit
			</BlankButton>
		</div>
	</>
}
export default SettingsOverlayModule;
