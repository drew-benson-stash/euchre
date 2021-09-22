import { useAppSelector } from "../app/hooks";
import { Card as CardModel } from "../game/card-models";
import { Player as PlayerModel, TableState } from "../game/game-state";
import { Card } from "./Card";
import { Hand } from "./Hand";
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
				<Player playerIndex={player.index}></Player>
			)}
		</div>
	);
}
