import { Card, CardSuit, suitToImage, rankToCode } from "../game/card-models";
import styles from "./MiniCard.module.css";

export interface MiniCardProps {
	readonly card: Card;
}

const suitToColor: Record<CardSuit, string> = {
	[CardSuit.CLUBS]: "black",
	[CardSuit.SPADES]: "black",
	[CardSuit.DIAMONDS]: "red",
	[CardSuit.HEARTS]: "red",
}

export function MiniCard(props: MiniCardProps) {
	const suit = props.card.suit;

	return (
		<span className={styles.miniCard} style={{color: suitToColor[suit]}}>
			{rankToCode(props.card.rank)}
			<img alt={suit} className={styles.miniSuit} src={suitToImage[suit]}></img>
		</span>
	)
}
