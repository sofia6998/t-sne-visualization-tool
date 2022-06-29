import React, { FC } from "react";
import styles from "./Input.module.scss";


type InputProps = {
  onChange: (val: string) => void;
  className?: string;
  value?: number;
};

const Input: FC<InputProps> = (props) => {
  const {
    onChange,
    value,
  } = props;

  return (
      <input
          className={styles.wrapper}
          value={value}
          onChange={(e) => onChange(e.target.value)}
      />
  );
};

export default Input;
