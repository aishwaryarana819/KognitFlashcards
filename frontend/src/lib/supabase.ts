import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient} from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log("Checking environment variables ", process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log("Checking environment variables ", process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

if (!supabaseUrl || !supabaseAnonKey)
    throw new Error("Missing supabase environment variables");

export const supabase =
    createClient(supabaseUrl, supabaseAnonKey,
        {
            auth: {
                storage: AsyncStorage,
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: false,
            },
        });