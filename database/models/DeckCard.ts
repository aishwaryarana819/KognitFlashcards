import {Model} from "@nozbe/watermelondb";
import {relation} from "@nozbe/watermelondb/decorators";

export default class DeckCard extends Model {
    static table = "deck_cards";
    static associations = {
        decks: {type: "belongs_to", key: "deck_id"},
        cards: {type: "belongs_to", key: "card_id"},
    } as const;

    @relation("decks", "deck_id") deck!: any;
    @relation("cards", "card_id") card!: any;
}