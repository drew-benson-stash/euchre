import { cardToFileName } from "./Card";
import styles from "./CardParty.module.css";
import { deck, getWinners } from "../game/game-rules";
import { Player } from "../game/game-state";
import { useAppSelector } from "../app/hooks";

const NUM_CARDS = 150;

const MIN_DURATION = 6000;
const MAX_DURATION = 10000;

function rand(max: number, min = 0): number {
	return Math.floor(Math.random() * (max - min)) + min;
}

function newFlyingCard(i: number): JSX.Element {
	const card = deck[rand(deck.length)];
	const src = cardToFileName(card);
	const duration = rand(MIN_DURATION, MAX_DURATION);

	const style = {
		animationDuration: `${duration}ms`,
		top: `-${rand(600) + 400}px`,
		left: `${rand(window.innerWidth + 200) - 100}px`,
	};
	
	return (
		<img
			key={i}
			className={styles.cardImage}
			alt="flying card"
			src={src}
			style={style}
		></img>
	);
}

// Initializing this outside the Component so only one set is ever created
const cards = Array.from(Array(NUM_CARDS).keys()).map(newFlyingCard);

export function CardParty() {
	const game = useAppSelector(state => state.game);

	const winners = getWinners(game.scores, game.players) || [];

	return (
		<div className={styles.cardPartyOverlay}>
			{cards}
			<div className={styles.congratsMessage}>
				<div>Congratulations</div>
				<div>{winners.map(p => p.name).join(" & ")}!</div>
			</div>
		</div>
	);
}
