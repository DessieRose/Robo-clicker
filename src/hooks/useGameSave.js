import { useEffect, useCallback, useRef } from "react";

const SAVE_KEY = "robotGameSave";
const SAVE_VERSION = 1;

export const loadGame = () => {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return null;
        const save = JSON.parse(raw);
        // Handle older save versions here later
        return save;
    } catch {
        return null;
    }
};

export const useGameSave = (gameState) => {
    const { level, maxLevel, money, totalMoneyEarned,
        exp, enemiesDefeated, clickCount,
        upgrades, autoUpgrades } = gameState;
    
    const save = useCallback(() => {
        const saveData = {
            version: SAVE_VERSION,
            savedAt: Date.now(), 
            level,
            maxLevel,
            money,
            totalMoneyEarned,
            exp,
            enemiesDefeated,
            clickCount,
            upgrades,
            autoUpgrades
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    }, [level, maxLevel, money, totalMoneyEarned, exp, enemiesDefeated, clickCount, upgrades, autoUpgrades]);

    const saveRef = useRef(save);
    useEffect(() => { saveRef.current = save; });

    // Auto-save every 10 seconds
    useEffect(() => {
        const id = setInterval(save, 10000);
        return () => clearInterval(id);
    }, [save]);

    // Save on level up
    useEffect(() => { saveRef.current(); }, [level]);

    return save;
};