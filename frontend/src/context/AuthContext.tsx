import React, { createContext, useContext, useState, useEffect } from "react";
import {AppState, AppStateStatus} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Session, User} from "@supabase/supabase-js";
import {supabase} from "../lib/supabase";

const INACTIVITY_EXPIRE_MS = 3 * 24 * 60 * 60 * 1000; // 3 days if user doesn't do anything
const ABSOLUTE_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days expiry no matter what

const LAST_LOGIN_KEY = '@auth_last_login';
const LAST_ACTIVITY_KEY = '@auth_last_activity';

type AuthContextType = {
    session: Session | null;
    user: User | null;
    profile: any | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: (session?: Session | null) => Promise<void>;
};

const AuthContext =
    createContext<AuthContextType>({
        session: null,
        user: null,
        profile: null,
        isLoading: true,
        signOut: async () => {},
        refreshProfile: async () => {},
    });

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshProfile = async (providedSession?: Session | null) => {
        const currentSession = providedSession || (await supabase.auth.getSession()).data.session;

        if (currentSession?.access_token) {
            try {
                const res = await fetch('http://127.0.0.1:8000/api/auth/profile', {
                    headers: {'Authorization': `Bearer ${currentSession.access_token}`}
                });
                if (res.ok) setProfile(await res.json());
                else setProfile(null);
            }
            catch(error) {
                console.error('Profile fetch failed: ', error);
                setProfile(null);
            }
        }
        else setProfile(null);
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        await AsyncStorage.multiRemove([LAST_LOGIN_KEY, LAST_ACTIVITY_KEY]);
        setSession(null);
        setUser(null);
        setProfile(null);
    };

    const validateSessionExpiry = async () => {
        const now = Date.now();
        const lastLogin = await AsyncStorage.getItem(LAST_LOGIN_KEY);
        const lastActivity = await AsyncStorage.getItem(LAST_ACTIVITY_KEY);

        if (lastLogin && (now - parseInt(lastLogin, 10) > ABSOLUTE_EXPIRY_MS)) {
            console.log("Session expired. It's been 30 days. Please log in again.")
            await signOut();
            return false;
        }

        if (lastActivity && (now - parseInt(lastActivity, 10) > INACTIVITY_EXPIRE_MS)) {
            console.log("Session expired. We haven't seen you in 3 days; we were worried! Please login again.")
            await signOut();
            return false;
        }

        await AsyncStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
        return true;
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const {data} = await supabase.auth.getSession();

            if (data.session) {
                const isValid = await validateSessionExpiry();
                if (isValid) {
                    setSession(data.session);
                    setUser(data.session.user);
                    await refreshProfile();
                }
            }
            setIsLoading(false);
        };

        initializeAuth();

        const {data: authListener} = supabase.auth.onAuthStateChange(async (
            event, newSession) => {
            if (event === 'SIGNED_IN' && newSession) {
                const now = Date.now().toString();
                await AsyncStorage.multiSet([
                    [LAST_LOGIN_KEY, now],
                    [LAST_ACTIVITY_KEY, now]
                ]);
            }

            if (newSession) {
                await validateSessionExpiry();
                await refreshProfile(newSession);
            }
            else setProfile(null);
            setUser(newSession?.user ?? null);
        });

        const appStateSubscription = AppState.addEventListener('change',
            async (nextAppState: AppStateStatus) => {
                if (nextAppState === 'active' && session)
                    await validateSessionExpiry();
            });

        return () => {
            authListener.subscription.unsubscribe();
            appStateSubscription.remove();
        };
    }, []);

    return(
        <AuthContext.Provider value={{
            session, user, profile,
            isLoading, signOut, refreshProfile}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};