import React, {useEffect, useState} from 'react';
import {DeviceEventEmitter} from 'react-native';
import {AddCard} from './AddCard';
import {AddDeck} from './AddDeck';
import {AddShelf} from './AddShelf';
import {supabase} from '../lib/supabase';

export const GlobalModals = () => {
    const [cardVisible, setCardVisible] = useState(false);
    const [deckVisible, setDeckVisible] = useState(false);
    const [shelfVisible, setShelfVisible] = useState(false);
    const [cardInitialData, setCardInitialData] = useState(false);

    const [decks, setDecks] = useState([]);
    const [shelves, setShelves] = useState([]);

    useEffect(() => {
        const sub1 = DeviceEventEmitter.addListener('open_add_card', (params?: any) => {
            fetchMetadata();
            setCardInitialData(params?.initialData || null);
            setCardVisible(true);
        });
        const sub2 = DeviceEventEmitter.addListener('open_add_deck', () => { fetchMetadata(); setDeckVisible(true); });
        const sub3 = DeviceEventEmitter.addListener('open_add_shelf', () => { fetchMetadata(); setShelfVisible(true); });

        return () => {
            sub1.remove(); sub2.remove(); sub3.remove();
        };
    }, []);

    const fetchMetadata = async () => {
        try {
            const {data: session} = await supabase.auth.getSession();
            if (!session.session) return;

            const [decksRes, shelvesRes] = await Promise.all([
                fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/decks/?t=${Date.now()}`, { headers: { 'Authorization': `Bearer ${session.session.access_token}` } }),
                fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/shelves/?t=${Date.now()}`, { headers: { 'Authorization': `Bearer ${session.session.access_token}` } })
            ]);

            if (decksRes.ok) {
                const d = await decksRes.json();
                setDecks(d.results || []);
            }
            if (shelvesRes.ok) {
                const s = await shelvesRes.json();
                setShelves(s.results || []);
            }
        } catch (e) {
            console.error("Failed to fetch metadata for modals", e);
        }
    };

    const handleCreateCard = async (data: any) => {
        const {data: session} = await supabase.auth.getSession();
        await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/cards/`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${session.session?.access_token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        setCardVisible(false);
        DeviceEventEmitter.emit('library_updated');
    };

    const handleCreateDeck = async (data: any) => {
        const {data: session} = await supabase.auth.getSession();
        await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/decks/`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${session.session?.access_token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        setDeckVisible(false);
        DeviceEventEmitter.emit('library_updated');
    };

    const handleCreateShelf = async (data: any) => {
        const {data: session} = await supabase.auth.getSession();
        await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/shelves/`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${session.session?.access_token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        setShelfVisible(false);
        DeviceEventEmitter.emit('library_updated');
    };

    return (
        <>
            <AddCard visible={cardVisible} onClose={() => setCardVisible(false)} onSubmit={handleCreateCard} availableDecks={decks} initialData={cardInitialData} />
            <AddDeck visible={deckVisible} onClose={() => setDeckVisible(false)} onSubmit={handleCreateDeck} availableShelves={shelves} />
            <AddShelf visible={shelfVisible} onClose={() => setShelfVisible(false)} onSubmit={handleCreateShelf} />
        </>
    );
};
