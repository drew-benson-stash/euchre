import { Fragment } from "react";
import { useAppSelector } from "../app/hooks";
import { CardSuit, suitToImage } from "../game/card-models";
import styles from "./SuitButtons.module.css";

export interface SuitButtonsProps {
	readonly onSuitClick: (suit: CardSuit) => void;
}

export function SuitButtons(props: SuitButtonsProps) {
	const upCardSuit = useAppSelector(state => state.game.table.upCard)?.suit;

	const suits = Object.keys(CardSuit).map(suit => suit as CardSuit).filter(suit => suit !== upCardSuit);

	return (
		<Fragment>
			{suits.map(suit => 
				<button
					key={suit}
					className={styles.suitButton}
					onClick={() => props.onSuitClick(suit as CardSuit)}
					style={{backgroundImage: `url('${suitToImage[suit as CardSuit]}')`}}
				>&nbsp;</button>
			)}
		</Fragment>
	)
}
