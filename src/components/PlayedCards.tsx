import { useAppSelector } from "../app/hooks"
import { Card } from "./Card";

export function PlayedCards(props: any) {
	const plays = useAppSelector(state => state.game.table.plays);

	return (
		<div>
			TEST
			{plays.map((play, i) =>
				<Card
					key={play.card.key}
					card={play.card}
				></Card>
			)}
		</div>
	)
}
