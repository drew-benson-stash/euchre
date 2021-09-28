import { Cards } from "../game/card-models";
import { MiniCard } from "./MiniCard";

export interface MiniStackProps {
	readonly cards: Cards
}

export function MiniStack(props: MiniStackProps) {
	return (
		<div>
			{props.cards.map(card => <MiniCard key={card.code} card={card}></MiniCard>)}
		</div>
	)
}
