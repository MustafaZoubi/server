const RAWG_BASE = "https://api.rawg.io/api";
const KEY = process.env.RAWG_API_KEY;

export const getGameImages = async (rawgId) => {
    if (!rawgId) {
        return { background: null, screenshots: [] };
    }

    try {
        const res = await fetch(
            `${RAWG_BASE}/games/${rawgId}?key=${KEY}`
        );

        if (!res.ok) {
            console.warn("RAWG game fetch failed:", rawgId);
            return { background: null, screenshots: [] };
        }

        const data = await res.json();

        return {
            background: data.background_image || null,

            screenshots: data.background_image_additional
                ? [data.background_image_additional]
                : []
        };        
    } catch (err) {
        console.warn("RAWG error:", err.message);
        return { background: null, screenshots: [] };
    }
};
