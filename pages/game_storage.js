/**
 * Game Storage System (via localStorage)
 * Supports:
 * - High Scores
 * - Level Progress (1-10)
 * - Multi-profile (prefixed by Names)
 */

const GameStorage = {
    // --- HELPER ---

    /**
     * Get the current user's name from astro_settings to use as a prefix.
     * @returns {string} The prefix (e.g., "PlayerName_")
     */
    getUserPrefix: function () {
        try {
            const settings = localStorage.getItem('astro_settings');
            if (settings) {
                const data = JSON.parse(settings);
                if (data.name && data.name.trim() !== "") {
                    // Sanitize name for keys (letters and numbers only)
                    const cleanName = data.name.trim().replace(/[^a-zA-Z0-9čćžšđČĆŽŠĐ]/g, '');
                    return cleanName + "_";
                }
            }
        } catch (e) {
            console.warn("[GameStorage] Failed to read settings:", e);
        }
        return "Guest_"; // Default prefix if no name set
    },

    // --- ARCADE & MISSION GAMES (High Score) ---

    /**
     * @param {string} gameId 
     * @param {number} score 
     * @returns {boolean} - True if it was a new high score
     **/
    saveHighScore: function (gameId, score) {
        try {
            const prefix = this.getUserPrefix();
            const key = prefix + gameId + '_highscore';
            const currentVal = this.getHighScore(gameId);

            if (score > currentVal) {
                localStorage.setItem(key, score);
                console.log(`[GameStorage] New High Score for ${key}: ${score}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error('[GameStorage] Error saving high score:', error);
            return false;
        }
    },

    /**
     * Get the current high score.
     */
    getHighScore: function (gameId) {
        try {
            const prefix = this.getUserPrefix();
            const key = prefix + gameId + '_highscore';
            const saved = localStorage.getItem(key);
            return saved ? parseInt(saved, 10) : 0;
        } catch (error) {
            return 0;
        }
    },

    // --- PROGRESS TRACKING (Level Unlocks) ---

    /**
     * Save the highest level reached for a game.
     */
    saveProgress: function (gameId, level) {
        try {
            const prefix = this.getUserPrefix();
            const key = prefix + gameId + '_level';
            const currentMax = this.getSavedLevel(gameId);

            if (level > currentMax) {
                localStorage.setItem(key, level);
                console.log(`[GameStorage] Progress saved for ${key}: Level ${level}`);
            }
        } catch (error) {
            console.error('[GameStorage] Error saving progress:', error);
        }
    },

    /**
     * Get the highest saved level for a game.
     */
    getSavedLevel: function (gameId) {
        try {
            const prefix = this.getUserPrefix();
            const key = prefix + gameId + '_level';
            const saved = localStorage.getItem(key);
            return saved ? parseInt(saved, 10) : 1;
        } catch (error) {
            return 1;
        }
    },

    // --- CURRENCY (Star Credits) ---

    /**
     * Add credits to the current profile.
     */
    addCredits: function (amount) {
        try {
            const prefix = this.getUserPrefix();
            console.log(`[GameStorage] Attempting to add ${amount} credits to prefix: "${prefix}"`);
            if (prefix === "Guest_") {
                console.log("[GameStorage] Guest session: Credits not saved to wallet.");
                return;
            }
            const key = prefix + 'total_credits';
            const current = this.getCredits();
            const newVal = current + amount;
            localStorage.setItem(key, newVal);
            console.log(`[GameStorage] Saved! New total for ${key}: ${newVal}`);
        } catch (e) {
            console.error('[GameStorage] Error saving credits:', e);
        }
    },

    /**
     * Get total credits for current profile.
     */
    getCredits: function () {
        try {
            const prefix = this.getUserPrefix();
            if (prefix === "Guest_") return 0;
            const key = prefix + 'total_credits';
            const saved = localStorage.getItem(key);
            return saved ? parseInt(saved, 10) : 0;
        } catch (e) {
            return 0;
        }
    },

    // --- OTHER ---

    resetProfileProgress: function () {
        const prefix = this.getUserPrefix();
        if (prefix === "Guest_") return;

        // Iteriraj i briši sve što počinje s tim prefixom
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(prefix)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        console.log(`[GameStorage] Reset all progress for profile: ${prefix}`);
    },

    // --- INVENTORY & SHOP ---

    /**
     * Catalog of all available items
     */
    ShopData: {
        suits: [
            { id: 'suit_white', name: 'Standardna', price: 0, color: '#ffffff', type: 'suit' },
            { id: 'suit_blue', name: 'Plava', price: 0, color: '#4CC9F0', type: 'suit' },
            { id: 'suit_purple', name: 'Ljubičasta', price: 0, color: '#7000ff', type: 'suit' },
            { id: 'suit_gold', name: 'Zlatna', price: 500, color: '#FFD700', type: 'suit' },
            { id: 'suit_red', name: 'Crvena', price: 250, color: '#ff4d4d', type: 'suit' },
            { id: 'suit_black', name: 'Svemirska', price: 350, color: '#2c3e50', type: 'suit' },
            { id: 'suit_green', name: 'Vanzemaljska', price: 200, color: '#2ecc71', type: 'suit' }
        ],
        visors: [
            { id: 'visor_blue', name: 'Standardni', price: 0, color: '#00d2ff', type: 'visor' },
            { id: 'visor_dark', name: 'Tamni', price: 0, color: '#1a0033', type: 'visor' },
            { id: 'visor_gold', name: 'Zlatni', price: 400, color: '#ffd700', type: 'visor' },
            { id: 'visor_pink', name: 'Rozi', price: 150, color: '#ff6b6b', type: 'visor' },
            { id: 'visor_green', name: 'Matrix', price: 200, color: '#00ff00', type: 'visor' }
        ],
        eyes: [
            { id: 'eye_black', name: 'Tamne', price: 0, color: '#333333', type: 'eye' },
            { id: 'eye_blue', name: 'Plave', price: 0, color: '#4CC9F0', type: 'eye' },
            { id: 'eye_purple', name: 'Mistične', price: 0, color: '#7000ff', type: 'eye' },
            { id: 'eye_red', name: 'Robot', price: 100, color: '#ff0000', type: 'eye' },
            { id: 'eye_white', name: 'Duh', price: 150, color: '#ffffff', type: 'eye' }
        ],
        hats: [
            { id: 'hat_none', name: 'Bez Kape', price: 0, type: 'hat', path: '' },
            { id: 'hat_antenna', name: 'Antena', price: 200, type: 'hat', path: '<path d="M100 0 L100 -40 M100 -40 L90 -30 M100 -40 L110 -30" stroke="white" stroke-width="4" stroke-linecap="round" /> <circle cx="100" cy="-45" r="5" fill="red" />' },
            { id: 'hat_cowboy', name: 'Kauboj', price: 400, type: 'hat', path: '<path d="M50 10 Q100 40 150 10 L140 -20 Q100 -50 60 -20 Z" fill="#8B4513" stroke="#5D4037" stroke-width="2"/> <rect x="75" y="-30" width="50" height="30" fill="#8B4513" rx="5" />' },
            { id: 'hat_crown', name: 'Kruna', price: 800, type: 'hat', path: '<path d="M70 5 L70 -25 L90 -10 L100 -35 L110 -10 L130 -25 L130 5 Z" fill="#FFD700" stroke="#E6BE00" stroke-width="2"/>' }
        ]
    },

    /**
     * Get list of owned item IDs.
     */
    getInventory: function () {
        try {
            const prefix = this.getUserPrefix();
            if (prefix === "Guest_") return this.getDefaultInventory();

            const key = prefix + 'inventory';
            const saved = localStorage.getItem(key);
            if (!saved) return this.getDefaultInventory();

            return JSON.parse(saved);
        } catch (e) {
            console.error("[GameStorage] Error getting inventory:", e);
            return this.getDefaultInventory();
        }
    },

    getDefaultInventory: function () {
        // IDs of all items with price 0
        const allItems = [
            ...this.ShopData.suits,
            ...this.ShopData.visors,
            ...this.ShopData.eyes,
            ...this.ShopData.hats
        ];
        return allItems.filter(i => i.price === 0).map(i => i.id);
    },

    /**
     * Check if user owns an item.
     */
    isOwned: function (itemId) {
        const inventory = this.getInventory();
        return inventory.includes(itemId);
    },

    /**
     * Buy an item.
     */
    buyItem: function (itemId) {
        const prefix = this.getUserPrefix();
        if (prefix === "Guest_") return { success: false, message: "Gosti ne mogu kupovati!" };

        if (this.isOwned(itemId)) return { success: false, message: "Već posjeduješ ovo!" };

        // Find item
        let item = null;
        for (const cat in this.ShopData) {
            const found = this.ShopData[cat].find(i => i.id === itemId);
            if (found) {
                item = found;
                break;
            }
        }

        if (!item) return { success: false, message: "Predmet ne postoji." };

        const credits = this.getCredits();
        if (credits < item.price) return { success: false, message: "Nemaš dovoljno bodova!" };

        // Transaction
        const newCreditTotal = credits - item.price;
        const inventory = this.getInventory();
        inventory.push(itemId);

        try {
            localStorage.setItem(prefix + 'total_credits', newCreditTotal);
            localStorage.setItem(prefix + 'inventory', JSON.stringify(inventory));
            return { success: true, message: "Kupljeno!", newBalance: newCreditTotal };
        } catch (e) {
            console.error(e);
            return { success: false, message: "Greška pri spremanju." };
        }
    }
};
