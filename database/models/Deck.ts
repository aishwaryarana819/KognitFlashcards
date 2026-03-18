import {Model} from "@nozbe/watermelondb";
import {text, date, readonly, children} from "@nozbe/watermelondb/decorators";

export default class Deck extends Model {
    static table = "decks";
    static associations = {
        shelf_decks: {type: "has_many", foreignKey: "deck_id"},
        deck_cards: {type: "has_many", foreignKey: "deck_id"},
    } as const;

    @text("name") name!: string;
    @text("description") description?: string;

    @readonly @date("created_at") createdAt!: Date;
    @readonly @date("updated_at") updatedAt!: Date;

    @children("shelf_decks") shelfDecks!: any;
    @children("deck_cards") deckCards!: any;
}