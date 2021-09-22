import { Card as CardModel } from "../game/card-models";
import { Player, TableState } from "../game/game-state";
import { Card } from "./Card";
import { Hand } from "./Hand";

export interface TableProps {
	players: ReadonlyArray<Player>;
	state: TableState;
	onHandCardClick: (player: number, card: CardModel) => void;
}

export function Table(props: TableProps) {
	const handCardClickHandler = (player: number, card: CardModel) => props.onHandCardClick(player, card);

	return (
		<div>
			Up: <Card card={props.state.upCard!}></Card>
			{props.players.map((player, index) =>
				<Hand key={index}
					player={player}
					cards={props.state.hands[index]}
					onCardClick={card => handCardClickHandler(index, card)}
				></Hand>
			)}
		</div>
	);
}
