import { Card, Cards, CardSuit, shortValue, suitToFilename } from "../game/card-models";
import styles from "./MiniCard.module.css";

export interface MiniCardProps {
	readonly card: Card;
}

export function MiniCard(props: MiniCardProps) {
	return (
		<span className={styles.miniCard}>
			{shortValue(props.card.value)}
			<img className={styles.miniSuit} src={suitToFilename[props.card.suit]}></img>
		</span>
	)
}
