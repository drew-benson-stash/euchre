import { useAppSelector } from "../app/hooks";
import { suitToFilename } from "../game/card-models";
import { GamePhase } from "../game/game-state";
import { Card } from "./Card";
import { MiniStack } from "./MiniStack";
import { PlayedCards } from "./PlayedCards";
import { Player } from "./Player";
import { Scores } from "./Scores";
import styles from "./Table.module.css";

export function Table() {
	const game = useAppSelector(state => state.game);

	return (
		<div className={styles.table}>

			<div className={styles.topOfScreen}>
				<MiniStack cards={game.table.kitty}></MiniStack>

				{game.trump && game.phase === GamePhase.PLAY_HAND ?
						<img alt={`Trump suit is ${game.trump}`} className={styles.trumpSuit} src={suitToFilename[game.trump]}></img> : null
				}
			</div>

			<div className={styles.bottomOfScreen}>
				<Scores></Scores>
			</div>

			<div className={styles.centerField}>
				<div><Card card={game.table?.upCard} disabled={true}></Card></div>
				<PlayedCards></PlayedCards>
			</div>

			<div className={`${styles.player} ${styles.top} ${styles.left}`}>
				<Player playerIndex={0}></Player>
			</div>
			<div className={`${styles.player} ${styles.top} ${styles.right}`}>
				<Player playerIndex={1} tricksOnLeft={true}></Player>
			</div>
			<div className={`${styles.player} ${styles.bottom} ${styles.right}`}>
				<Player playerIndex={2} tricksOnLeft={true}></Player>
			</div>
			<div className={`${styles.player} ${styles.bottom} ${styles.left}`}>
				<Player playerIndex={3}></Player>
			</div>
		</div>
	);
}
