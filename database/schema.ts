import {appSchema, tableSchema} from '@nozbe/watermelondb';

export default appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: "shelves",
        columns: [
            {name: "name", type: "string"},
            {name: "description", type: "string", isOptional: true},
            {name: "created_at", type: "number"},
            {name: "updated_at", type: "number"}
        ],
        }),
        tableSchema({
            name: "decks",
            columns: [
                {name: "shelf_id", type: "string", isIndexed: true, isOptional: true},
                {name: "description", type: "string", isOptional: true},
                {name: "created_at", type: "number"},
                {name: "updated_at", type: "number"},
            ],
        }),
        tableSchema({
            name: "cards",
            columns: [
                {name: "front_content", type: "string"},
                {name: "back_content", type: "string"},
                {name: "interval", type: "number"},
                {name: "repetition", type: "number"},
                {name: "ease_factor", type: "number"},
                {name: "due_date", type: "number"},
                {name: "created_at", type: "number"},
                {name: "updated_at", type: "number"},
            ]
        }),
        tableSchema({
           name: "shelf_decks",
           columns: [
               {name: "shelf_id", type: "string", isIndexed: true},
               {name: "deck_id", type: "string", isOptional: true},
           ]
        }),
        tableSchema({
            name: "deck_cards",
            columns: [
                {name: "deck_id", type: "string", isIndexed: true},
                {name: "card_id", type: "string", isIndexed: true},
            ]
        }),
    ],
});