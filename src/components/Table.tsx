import { useAppSelector } from "../app/hooks";
import { cardName } from "../game/card-models";
import { Card } from "./Card";
import { Player } from "./Player";
import styles from "./Table.module.css";

export interface TableProps {
}

export function Table(props: TableProps) {
	// const handCardClickHandler = (player: number, card: CardModel) => props.onHandCardClick(player, card);
	const game = useAppSelector(state => state.game);

	return (
		<div className={styles.table}>
			<div>
				Up: <Card card={game.table?.upCard!} disabled={true}></Card>
			</div>
			<div>
				Kitty: {game.table.kitty.map(card => <Card key={card.key} card={card} disabled={true}></Card>)}
			</div>
			{game.players.map(player =>
				<Player key={player.index} playerIndex={player.index}></Player>
			)}

			<ol>
				Played: {game.table.plays.map(play =>
					<li key={play.card.key + play.player}>
						{play.player}: <Card card={play.card}></Card>
					</li>
				)}
			</ol>
		</div>
	);
}
