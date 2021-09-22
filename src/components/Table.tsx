import { useAppSelector } from "../app/hooks";
import { Card } from "./Card";
import { Player } from "./Player";

export interface TableProps {
}

export function Table(props: TableProps) {
	// const handCardClickHandler = (player: number, card: CardModel) => props.onHandCardClick(player, card);
	const game = useAppSelector(state => state.game);

	return (
		<div>
			Up: <Card card={game.table?.upCard!}></Card>
			{game.players.map(player =>
				<Player key={player.index} playerIndex={player.index}></Player>
			)}
		</div>
	);
}
