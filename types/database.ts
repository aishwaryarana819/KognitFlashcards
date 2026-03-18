export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            shelves: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    description: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    description?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    description?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            decks: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    description: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    description?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    description?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            cards: {
                Row: {
                    id: string
                    user_id: string
                    front_content: string
                    back_content: string
                    interval: number
                    repetition: number
                    ease_factor: number
                    due_date: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    front_content: string
                    back_content: string
                    interval?: number
                    repetition?: number
                    ease_factor?: number
                    due_date?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    front_content?: string
                    back_content?: string
                    interval?: number
                    repetition?: number
                    ease_factor?: number
                    due_date?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            shelf_decks: {
                Row: {
                    id: string
                    shelf_id: string
                    deck_id: string
                }
                Insert: {
                    id?: string
                    shelf_id: string
                    deck_id: string
                }
                Update: {
                    id?: string
                    shelf_id?: string
                    deck_id: string
                }
            }
            deck_cards: {
                Row: {
                    id: string
                    deck_id: string
                    card_id: string
                }
                Insert: {
                    id?: string
                    deck_id: string
                    card_id: string
                }
                Update: {
                    id?: string
                    deck_id?: string
                    card_id?: string
                }
            }
        }
    }
}
