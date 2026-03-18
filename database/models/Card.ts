import {Model} from "@nozbe/watermelondb";
import {text, field, date, readonly, children} from "@nozbe/watermelondb/decorators";

export default class Card extends Model {
    static table = "cards";
    static associations = {
        deck_cards: {type: "has_many", foreignKey: "card_id"},
    } as const;

    @text("front_content") frontContent!: string;
    @text("back_content") backContent!: string;

    @field("interval") interval!: number;
    @field("repetition") repetition!: number;
    @field("ease_factor") easeFactor!: number;
    @date("due_date") dueDate!: Date;

    @readonly @date("created_at") createdAt!: Date;
    @readonly @date("updated_at") updatedAt!: Date;

    @children("deck_Cards") deckCards!: any;
}