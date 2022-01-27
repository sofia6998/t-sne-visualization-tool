import styles from "./MenuComponents.module.scss";
import React from "react";

const SettingsOverlayModule: React.FC = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="60"
            height="160"
            fill="none"
            viewBox="0 0 60 160"
            className={styles.menu}
        >
            <path fill="#48485C" d="M0 0h54a6 6 0 016 6v148a6 6 0 01-6 6H0V0z"/>
            <path
                fill="#97E0CA"
                fillOpacity="0.28"
                d="M0 0h54a6 6 0 016 6v54H0V0z"
            />
            <path
                fill="#B7B6C1"
                d="M17.24 32.438a5.228 5.228 0 100-10.457 5.228 5.228 0 000 10.457zM42.76 37.666a5.228 5.228 0 100-10.457 5.228 5.228 0 000 10.457z"
            />
            <path
                fill="#7DC2C5"
                d="M36.517 23.703a5.229 5.229 0 100-10.458 5.229 5.229 0 000 10.458z"
            />
            <path
                fill="#DADADF"
                d="M34.682 35.373a5.228 5.228 0 100-10.457 5.228 5.228 0 000 10.457z"
            />
            <path
                fill="#7DC2C5"
                d="M22.468 46.762a5.228 5.228 0 100-10.457 5.228 5.228 0 000 10.457z"
            />
            <path
                fill="#9CFFFA"
                d="M14.502 69.501a5 5 0 109.998 0 5 5 0 00-9.998 0z"
            />
            <path
                fill="#7DC2C5"
                d="M25.001 69.501a5 5 0 109.998 0 5 5 0 00-9.998 0z"
            />
            <path
                fill="#DADADF"
                d="M35.507 69.501a5 5 0 109.998 0 5 5 0 00-9.998 0zM14.502 80a5 5 0 109.998 0 5 5 0 00-9.998 0z"
            />
            <path
                fill="#B7B6C1"
                d="M25.001 80a5 5 0 109.998 0 5 5 0 00-9.998 0z"
            />
            <path
                fill="#9CFFFA"
                d="M35.507 80a5 5 0 109.998 0 5 5 0 00-9.998 0z"
            />
            <path
                fill="#B7B6C1"
                d="M14.502 90.5a4.999 4.999 0 109.998 0 4.999 4.999 0 00-9.998 0z"
            />
            <path
                fill="#7DC2C5"
                d="M25.001 90.5a5 5 0 109.998 0 5 5 0 00-9.998 0z"
            />
            <path
                fill="#B7B6C1"
                d="M35.507 90.5a5 5 0 109.998 0 5 5 0 00-9.998 0z"
            />
            <path
                stroke="#B7B6C1"
                strokeMiterlimit="10"
                strokeWidth="2"
                d="M14.586 142.81c9.406-19.142 13.223-19.128 14.818-14.253.868 2.639.875 6.019 2.208 8.863 2.625 5.588 6.259.324 8.086-2.308 1.412-2.004 3.648-6.054 5.871-14.253"
            />
            <path
                stroke="#7DC2C5"
                strokeMiterlimit="10"
                strokeWidth="2"
                d="M18.016 145.498c.494-14.775 2.42-21.499 3.21-23.877 5.193-15.523 14.225-1.305 16.278 1.926 3.726 5.864 6.273 13.865 7.762 19.256"
            />
            <path
                stroke="#DADADF"
                strokeMiterlimit="10"
                strokeWidth="2"
                d="M16.244 144.348c2.166-.176 5.42-1.221 9.081-5.779 3.225-4.007 4.594-8.036 7.529-12.7 2.512-4.001 6.3-8.686 11.515-10.401"
            />
        </svg>
    );
}


export default SettingsOverlayModule;
