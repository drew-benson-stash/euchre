import { useAppSelector } from "../app/hooks"
import { Team } from "../game/game-state";

// const fourOfSpades = newCard(CardSuit.SPADES, 4);
// const sixOfSpades = newCard(CardSuit.SPADES, 6);
// const fourOfDiamonds = newCard(CardSuit.DIAMONDS, 4);
// const sixOfDiamonds = newCard(CardSuit.DIAMONDS, 6);

export function Scores() {
	const players = useAppSelector(state => state.game.players);
	const scores = useAppSelector(state => state.game.scores);

	return (
		<div>
			<div>
				Team A ({`${players[0].name} & ${players[2].name}`}): {scores[Team.A]}
			</div>
			<div>
				Team B ({`${players[1].name} & ${players[3].name}`}): {scores[Team.B]}
			</div>
		</div>
	)
}
