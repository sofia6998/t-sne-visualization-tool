import React, { CSSProperties } from "react";

import styles from "./BlankButton.module.scss";
import {classNames} from "../../helpers/classNames";

type BlankButtonProps = {
  className?: string;
  style?: CSSProperties;
  title?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  link?: string;
};
const BlankButton: React.FC<BlankButtonProps> = (props) => {
  const {
    link,
    onClick,
    title,
    disabled,
    className,
    children,
    ...restProps
  } = props;
  if (link) {
    return (
      <a
        href={disabled ? undefined : link}
        title={title}
        style={props.style}
        className={classNames(styles.button, className, disabled && styles.disabled)}
        {...restProps}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={props.style}
      className={classNames(styles.button, className)}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default BlankButton;
