import {createContext, useContext, useEffect, useState} from "react";
import {useColorScheme} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {lightPalette, darkPalette, ColorPalette} from "../theme/colors";

const THEME_STORAGE_KEY = "@app_theme_preferences";

type ThemeContextType = {
    isDark: boolean;
    activePalette: ColorPalette;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
    isDark: false,
    activePalette: lightPalette,
    toggleTheme: () => {},
});

export const ThemeProvider = ({children}: {children: React.ReactNode}) => {
    const systemColorScheme = useColorScheme();
    const [isDark, setIsDark] = useState<boolean>(false);

    useEffect(() => {
        const loadSavedTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedTheme !== null) {
                    setIsDark(savedTheme === 'dark');
                } else {
                    setIsDark(systemColorScheme === 'dark');
                }
            } catch (error) {
                console.warn("Failed to load saved theme preference ", error);
            }
        };
        loadSavedTheme();
    }, [systemColorScheme]);

    const toggleTheme = async () => {
        try {
            const newThemeIsDark = !isDark;
            setIsDark(newThemeIsDark);
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newThemeIsDark ? 'dark' : 'light');
        } catch (error) {
            console.warn("Failed to saved theme preference ", error);
        }
    };

    const activePalette = isDark ? darkPalette : lightPalette;

    return (
        <ThemeContext.Provider value={{isDark, toggleTheme, activePalette}}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);