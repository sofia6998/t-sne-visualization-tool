import React from "react";
import styles from "./Layout.module.scss";
import MenuComponents from "./MenuComponents";

const Layout: React.FC = (props) => {
	const { children } = props;
	return (
		<div className={styles.container}>
			<MenuComponents/>
			{children}
		</div>
	);
}

export default Layout;
