import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Library } from '../screens/Library';
import { DeckDetail } from '../screens/DeckDetail';
import { ROUTES } from './routes';
import { LibraryStackParamList } from './NavigationTypes';
import {ShelfDetail} from '../screens/ShelfDetail';

const Stack = createNativeStackNavigator<LibraryStackParamList>();

export const LibraryStack = () => {
    return (
        /* @ts-ignore */
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
            <Stack.Screen name={ROUTES.LIBRARY} component={Library} />
            <Stack.Screen name={ROUTES.DECK_DETAIL} component={DeckDetail} />
            <Stack.Screen name={ROUTES.SHELF_DETAIL} component={ShelfDetail} />
        </Stack.Navigator>
    );
};
