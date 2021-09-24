import { Fragment } from "react";
import { CardSuit, suitToFilename } from "../game/card-models";
import styles from "./SuitButtons.module.css";

export interface SuitButtonsProps {
	readonly onSuitClick: (suit: CardSuit) => void;
}

export function SuitButtons(props: SuitButtonsProps) {
	return (
		<Fragment>
			{Object.keys(CardSuit).map(suit => 
				<button
					className={styles.suitButton}
					onClick={() => props.onSuitClick(suit as CardSuit)}
					style={{backgroundImage: `url('${suitToFilename[suit as CardSuit]}')`}}
				>&nbsp;</button>
			)}
		</Fragment>
	)
}
