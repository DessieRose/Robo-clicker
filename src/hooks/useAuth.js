import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { migrateGuestSave } from './useGameSave';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setAuthLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null);
        });

        return () => { subscription.unsubscribe(); };
    }, []);

    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) await migrateGuestSave(data.user.id);
        return data;
    };

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    };
    
    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return { user, authLoading, signUp, signIn, signOut };
};