import {Model} from "@nozbe/watermelondb";
import {text, date, readonly, children} from "@nozbe/watermelondb/decorators";

export default class Shelf extends Model {
    static table  = "shelves";

    static associations = {
        shelf_decks: {type: "has_many", foreignKey: "shelf_id"},
    } as const;

    @text('name') name!: string;
    @text('description') description?: string;

    @readonly @date("created_at") createdAt!: Date;
    @readonly @date("updated_at") updatedAt!: Date;

    @children("shelf_decks") shelfDecks!: any;
}