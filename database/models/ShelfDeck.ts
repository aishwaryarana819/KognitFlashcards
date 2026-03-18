import {Model} from "@nozbe/watermelondb";
import {relation} from "@nozbe/watermelondb/decorators";

export default class ShelfDeck extends Model {
    static table = "shelf_decks";
    static associations = {
        shelves: {type: "belongs_to", key: "shelf_id"},
        decks: {type: "belongs_to", key: "deck_id"},
    } as const;

    @relation("shelves", "shelf_id") shelf!: any;
    @relation("decks", "deck_id") deck!: any;
}