import Reac, {createContext, useState, useEffect, useContext} from "react";
import {Session, User} from "@supabase/supabase-js";
import {supabase} from "./supabase";

type AuthContextType = {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    isLoading: true,
})

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({data : {session}}) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        const {data: authListener} = supabase.auth.onAuthStateChange(
            (_event, newSession) => {
                setSession(newSession);
                setUser(newSession?.user ?? null);
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value = {{user, session, isLoading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);