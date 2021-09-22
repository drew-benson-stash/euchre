import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Cards } from "../game/card-models";
import { selectPhase } from "../game/game-slice";
import { Player as PlayerModel } from "../game/game-state";

export interface PlayerProps {
	player: PlayerModel;
	hand: Cards;
}

export function Player(props: PlayerProps) {
	const phase = useAppSelector(selectPhase);

	return (
		<div>
			Hello
		</div>
	)
}
