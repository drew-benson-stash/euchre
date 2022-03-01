import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addPlayers } from "../game/game-slice";
import { GamePhase } from "../game/game-state";
import { Table } from "./Table";
import styles from "./Game.module.css";
import { getPeople } from "../names/names-api";

export function Game() {

	const phase = useAppSelector(state => state.game.phase);

	const dispatch = useAppDispatch();

	const playerButtonHandler = async () => {
		const names = await getPeople(4);
		dispatch(addPlayers(names));
	}

	if (phase === GamePhase.ADD_PLAYERS) {
		return (
			<div
				className={styles.splashScreen}
				style={{backgroundImage: `url('images/splashscreen.png')`}}
			>
				<button onClick={playerButtonHandler}>START</button>
			</div>
		);
	} else {
		return (
			<div>
				<a 
					className={styles.sourceLink}
					href="https://github.com/drew-benson-stash/euchre"
					target="_blank"
				>
					github.com/adbenson/euchre
				</a>
				<Table></Table>
			</div>
		);
	}
}
