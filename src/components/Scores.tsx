import { useAppSelector } from "../app/hooks"
import { BACK_OF_CARD_IMAGE, Card, CardSuit, cardToImage, newCard } from "../game/card-models";
import { Team } from "../game/game-state";
import styles from "./Scores.module.css";

const CARD_WIDTH = 70;
const CARD_MARGIN = 5;

const fourOfSpades = newCard(CardSuit.SPADES, 4);
const sixOfSpades = newCard(CardSuit.SPADES, 6);
const fourOfDiamonds = newCard(CardSuit.DIAMONDS, 4);
const sixOfDiamonds = newCard(CardSuit.DIAMONDS, 6);

enum Value {
	BACK_OF_CARD = "BACK_OF_CARD",
	SIX = "SIX",
	FOUR = "FOUR",
}

enum Location {
	LEFT, LEFT_OFFSET, RIGHT,
	// "Four Show One" means "A card in this position on top of a Four card will Show One pip"
	FOUR_SHOW_ONE, FOUR_SHOW_TWO, FOUR_SHOW_THREE,
	SIX_SHOW_ONE, SIX_SHOW_TWO, SIX_SHOW_THREE, SIX_SHOW_FOUR, SIX_SHOW_FIVE,
}

interface Position {
	readonly x: number;
	readonly y: number;
	/** Rotation in degrees */
	readonly r: number;
}

const positions: Record<Location, Position> = {
	[Location.LEFT]: {x: 0, y: 0, r: 0},
	[Location.LEFT_OFFSET]: {x: CARD_MARGIN, y: CARD_MARGIN, r: 0},
	[Location.RIGHT]: {x: CARD_WIDTH + CARD_MARGIN, y: 0, r: 0},
	[Location.FOUR_SHOW_ONE]: {x: 24, y: 9, r: 28},
	[Location.FOUR_SHOW_TWO]: {x: 0, y: 23, r: 90},
	[Location.FOUR_SHOW_THREE]: {x: 43, y: 21, r: 28},
	[Location.SIX_SHOW_ONE]: {x: 20, y: 4, r: 37},
	[Location.SIX_SHOW_TWO]: {x: 0, y: 21, r: 90},
	[Location.SIX_SHOW_THREE]: {x: 32, y: 17, r: 41},
	[Location.SIX_SHOW_FOUR]: {x: 0, y: 51, r: 90},
	[Location.SIX_SHOW_FIVE]: {x: 37, y: 38, r: 41},
}

interface ScoreCard {
	value: Value,
	location: Location,
}

const scoreToCards: ReadonlyArray<ReadonlyArray<ScoreCard>> = [
	[	// 0
		{value: Value.SIX, location: Location.LEFT},
		{value: Value.BACK_OF_CARD, location: Location.LEFT_OFFSET}
	],
	[	// 1
		{value: Value.SIX, location: Location.LEFT},
		{value: Value.BACK_OF_CARD, location: Location.SIX_SHOW_ONE}
	],
	[	// 2
		{value: Value.SIX, location: Location.LEFT},
		{value: Value.BACK_OF_CARD, location: Location.SIX_SHOW_TWO}
	],
	[	// 3
		{value: Value.SIX, location: Location.LEFT},
		{value: Value.BACK_OF_CARD, location: Location.SIX_SHOW_THREE}
	],
	[	// 4
		{value: Value.SIX, location: Location.LEFT},
		{value: Value.BACK_OF_CARD, location: Location.SIX_SHOW_FOUR}
	],
	[	// 5
		{value: Value.SIX, location: Location.LEFT},
		{value: Value.BACK_OF_CARD, location: Location.SIX_SHOW_FIVE}
	],
	[	// 6
		{value: Value.SIX, location: Location.LEFT},
		{value: Value.BACK_OF_CARD, location: Location.RIGHT}
	],
	[	// 7
		{value: Value.FOUR, location: Location.LEFT},
		{value: Value.SIX, location: Location.FOUR_SHOW_ONE}
	],
	[	// 8
		{value: Value.FOUR, location: Location.LEFT},
		{value: Value.SIX, location: Location.FOUR_SHOW_TWO}
	],
	[	// 9
		{value: Value.FOUR, location: Location.LEFT},
		{value: Value.SIX, location: Location.FOUR_SHOW_THREE}
	],
	[	// 10
		{value: Value.FOUR, location: Location.LEFT},
		{value: Value.SIX, location: Location.RIGHT}
	],
];

function getImage(value: Value, team: Team): string {
	if (value === Value.BACK_OF_CARD) {
		return BACK_OF_CARD_IMAGE;
	}
	if (team === Team.A) {
		return value === Value.FOUR ?
			cardToImage(fourOfSpades) :
			cardToImage(sixOfSpades);
	}
	// Team B
	return value === Value.FOUR ?
		cardToImage(fourOfDiamonds) :
		cardToImage(sixOfDiamonds);
}

function flip(position: Position): Position {
	return {x: -position.x, y: position.y, r: -position.r};
}

function scoreCard(team: Team, value: Value, location: Location): JSX.Element {
	const image = getImage(value, team);
	const position = team === Team.A ? positions[location] : flip(positions[location]);

	const style = {
		transform: `translate(${position.x}px, ${position.y}px) rotate(${position.r}deg)`,
	}
	return (
		<img key={`${team}${value}`} className={styles.scoreCard} src={image} style={style} alt={value}></img>
	)
}

function scoreCards(score: number, team: Team): Array<JSX.Element> {
	// We can't really display scores over 10, which is fine,
	// but we can't have an undefined mapping here
	score = Math.min(score, 10);
	const cards = scoreToCards[score];
	return cards.map(({value, location}) => scoreCard(team, value, location));
}

export function Scores() {
	const players = useAppSelector(state => state.game.players);
	const scores = useAppSelector(state => state.game.scores);

	const cardsA = scoreCards(scores[Team.A], Team.A);
	const cardsB = scoreCards(scores[Team.B], Team.B);

	return (
		<div>
			<div className={`${styles.container} ${styles.scoresA}`}>
				<div className={styles.cards}>{cardsA}</div>
				<div className={styles.names}>{`${players[0].firstName} & ${players[2].firstName}`}</div>
			</div>
			<div className={`${styles.container} ${styles.scoresB}`}>
				<div className={styles.cards}>{cardsB}</div>
				<div className={styles.names}>{`${players[1].firstName} & ${players[3].firstName}`}</div>
			</div>
		</div>
	)
}
