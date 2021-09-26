import { useAppDispatch, useAppSelector } from "../app/hooks";
import { suitToImage } from "../game/card-models";
import { autoPlay } from "../game/game-slice";
import { GamePhase } from "../game/game-state";
import { Card } from "./Card";
import { CardParty } from "./CardParty";
import { MiniStack } from "./MiniStack";
import { PlayedCards } from "./PlayedCards";
import { Player } from "./Player";
import { Scores } from "./Scores";
import styles from "./Table.module.css";

export function Table() {
	const game = useAppSelector(state => state.game);
	const dispatch = useAppDispatch();

	const maker = game.maker && game.players[game.maker].firstName;

	const showTrump = game.trump && (game.phase === GamePhase.PLAY_HAND);


	return (
		<div className={styles.table}>

			<div className={styles.topOfScreen}>
				<MiniStack cards={game.table.kitty}></MiniStack>

				{game.trump && showTrump ?
					<span className={styles.trump}>
						{maker} ordered up
						<img alt={game.trump} className={styles.trumpSuit} src={suitToImage[game.trump!]}></img>
					</span>
					: null
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

			<button
				className={styles.fastForwardButton}
				onClick={() => dispatch(autoPlay())}
			>
				{">>"}
			</button>

			{game.phase === GamePhase.END ? <CardParty></CardParty> : null}
		</div>
	);
}
