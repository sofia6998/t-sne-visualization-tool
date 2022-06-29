import React, {useState} from "react";
import styles from "./ThemeToggle.module.scss";
import BlankButton from "./BlankButton";
import {getColorTheme, LIGHT, toggleColorTheme} from "../../helpers/themeHelper";

const ThemeToggle: React.FC<{}> = (props) => {
    const [isLight, setIsLight] = useState(getColorTheme() === LIGHT);
    return (
        <BlankButton
            data-cy="theme-toggle"
            {...props}
            onClick={() => {
                setIsLight(toggleColorTheme() === LIGHT);
            }}
            className={styles.themeToggleContainer}
        >
            {isLight
                ? <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="60"
                    height="60"
                    fill="none"
                    viewBox="0 0 60 60"
                >
                    <path
                        fill="#34344A"
                        d="M30 21a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"
                    />
                </svg>
            : <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="60"
                    height="60"
                    fill="none"
                    viewBox="0 0 60 60"
                >
                    <path
                        fill="#ECECEF"
                        d="M30 25c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm-10 6h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zm-9-11v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zm-5.01-15.42a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .38-.39.39-1.03 0-1.41l-1.06-1.06zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06a.996.996 0 000 1.41c.39.38 1.03.39 1.41 0l1.06-1.06zM25.05 36.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06a.996.996 0 000 1.41c.39.38 1.03.39 1.41 0l1.06-1.06z"
                    />
                </svg>}
        </BlankButton>
    );
};

export default ThemeToggle;

