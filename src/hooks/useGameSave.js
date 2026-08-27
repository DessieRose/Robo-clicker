import { useEffect, useCallback, useRef } from "react";
import { supabase } from "../lib/supabase";

const SAVE_KEY = "robotGameSave";
const SAVE_VERSION = 1;

// ── Load from localStorage ──
export const loadGame = () => {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

// ── Load from Supabase ──
export const loadFromSupabase = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('saves')
            .select('save_data')
            .eq('user_id', userId)
            .maybeSingle()

        if (error) {
            console.error('Error loading from Supabase:', error.message);
            return null;
        }
        return data?.save_data ?? null;
    } catch (err) {
        console.error('Unexpected error loading save:', err);
        return null;
    }
};

// ── When a guest signs up, push their local save to Supabase ─–
export const migrateGuestSave = async (userId) => {
    const localSave = loadGame();
    if (!localSave) return;
    const { error } = await supabase.from('saves').upsert({
        user_id: userId, 
        save_data: localSave,
        saved_at: new Date().toISOString(),
    });
    if (error) console.error('Error migrating guest save:', error.message);
};

// –– Save to Supabase ––
const saveToSupabase = async (userId, saveData) => {
    const { error } = await supabase.from('saves').upsert({
        user_id:   userId,
        save_data: saveData,
        saved_at:  new Date().toISOString(),
    });
    if (error) console.error('Error saving to Supabase:', error.message);
    else console.log('Saved to Supabase ✓');
};

// ── Save hook ──
export const useGameSave = (gameState, user, saveLoaded) => {
    const stateRef = useRef(gameState);
    stateRef.current = gameState;

    const userRef = useRef(user);
    userRef.current = user;

    const save = useCallback(() => {
        const {
            level, maxLevel, money, totalMoneyEarned,
            exp, enemiesDefeated, clickCount,
            upgrades, autoUpgrades, seenTips
        } = stateRef.current;
        const currentUser = userRef.current;

        const saveData = {
            version: SAVE_VERSION,
            savedAt: Date.now(),
            level, maxLevel, money, totalMoneyEarned,
            exp, enemiesDefeated, clickCount,
            upgrades, autoUpgrades,
            seenTips: seenTips ?? []
        };

        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
        console.log('Saved to localStorage ✓');

        if (currentUser) {
            saveToSupabase(currentUser.id, saveData);
        }
    }, []);

    // Auto-save every 10 seconds
    useEffect(() => {
        if (!saveLoaded) return; // Don't auto-save until the initial save is loaded
        const id = setInterval(save, 10000);
        return () => clearInterval(id);
    }, [save, saveLoaded]);

    // Save on kill or level up
    useEffect(() => { 
        if (!saveLoaded) return; // Don't save until the initial save is loaded
        save(); 
    }, [gameState.level, gameState.enemiesDefeated, gameState.seenTips, save, saveLoaded]);

    return { save };
};