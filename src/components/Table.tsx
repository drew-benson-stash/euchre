import { useAppSelector } from "../app/hooks";
import { cardName } from "../game/card-models";
import { Card } from "./Card";
import { CardStack } from "./CardStack";
import { PlayedCards } from "./PlayedCards";
import { Player } from "./Player";
import { Scores } from "./Scores";
import styles from "./Table.module.css";

export interface TableProps {
}

export function Table(props: TableProps) {
	// const handCardClickHandler = (player: number, card: CardModel) => props.onHandCardClick(player, card);
	const game = useAppSelector(state => state.game);

	return (
		<div className={styles.table}>
			<div>
				<Card card={game.table?.upCard!} disabled={true}></Card>
			</div>
			<div>
				<CardStack cards={game.table.kitty} disabled={true} splay={false}></CardStack>
			</div>

			<div className={`${styles.player} ${styles.top} ${styles.left}`}>
				<Player playerIndex={0}></Player>
			</div>
			<div className={`${styles.player} ${styles.top} ${styles.right}`}>
				<Player playerIndex={1}></Player>
			</div>
			<div className={`${styles.player} ${styles.bottom} ${styles.right}`}>
				<Player playerIndex={2}></Player>
			</div>
			<div className={`${styles.player} ${styles.bottom} ${styles.left}`}>
				<Player playerIndex={3}></Player>
			</div>

			<PlayedCards></PlayedCards>

			<Scores></Scores>
		</div>
	);
}
