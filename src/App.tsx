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
				<summary className={styles.welcomeContainer}>
					<h1>Euchre Demonstration App</h1>
					
					<p>This app demonstrates proficiency with React and Redux as well as general modern web development principles.</p>
					<p>For more information visit the <a target="_blank" href="https://github.com/adbenson/euchre">GitHub repository.</a></p>
					
				</summary>

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
