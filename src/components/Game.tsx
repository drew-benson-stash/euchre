import { Table } from "./Table";
import styles from "./Game.module.css";

export function Game() {

	return (
		<div>
			<a
				className={styles.sourceLink}
				href="https://github.com/adbenson/euchre"
				target="_blank"
			>
				github.com/adbenson/euchre
			</a>
			<Table></Table>
		</div>
	);


}
