import { Fragment } from "react";
import { CardSuit, suitToImage } from "../game/card-models";
import styles from "./SuitButtons.module.css";

export interface SuitButtonsProps {
	readonly onSuitClick: (suit: CardSuit) => void;
}

export function SuitButtons(props: SuitButtonsProps) {
	return (
		<Fragment>
			{Object.keys(CardSuit).map(suit => 
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
