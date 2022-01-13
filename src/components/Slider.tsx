import React from "react";
import ReactSlider from "react-slider";
import styles from "./Slider.module.scss";

type Props = {
	defaultValue?: number;
	disabled?: boolean;
	max: number;
	min: number;
	value: number;
	onChange: (value: number) => void;
}
const Slider: React.FC<Props> = (props) => {
	const {
		defaultValue, disabled,
		max, min, value, onChange
	} = props;

	return (
		<ReactSlider
			defaultValue={defaultValue}
			disabled={disabled}
			max={max}
			min={min}
			value={value}
			onChange={onChange}
			className={styles.slider}
			thumbClassName={styles.thumb}
			trackClassName={styles.track}
			renderThumb={(props, state) => <div {...props}><span>{state.valueNow}</span></div>}
		/>);
}

export default Slider;
