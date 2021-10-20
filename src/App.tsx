import './App.css';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { Game } from './components/Game';
import { addPlayers } from './game/game-slice';
import { GamePhase } from './game/game-state';
import { getPeople } from './names/names-api';
import styles from "./App.module.css";

function App() {

	const phase = useAppSelector(state => state.game.phase);

	const dispatch = useAppDispatch();

	const playerButtonHandler = async () => {
		const names = await getPeople(4);
		dispatch(addPlayers(names));
	}

	if (phase === GamePhase.INTRO) {
		return (
			<div
				className={styles.splashScreen}
				style={{backgroundImage: `url('images/splashscreen.png')`}}
			>
				<div className={styles.buttonContainer}>
					<button onClick={playerButtonHandler}>START</button>
				</div>
			</div>
		);
	} else {
		return (
			<Game></Game>
		);
	}

}

export default App;
