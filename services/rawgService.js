
const RAWG_BASE = "https://api.rawg.io/api";
const KEY = process.env.RAWG_API_KEY;

export const getGameImages = async (rawgId) => {
    const gameRes = await fetch(
        `${RAWG_BASE}/games/${rawgId}?key=${KEY}`
    );
    const gameData = await gameRes.json();

    const shotsRes = await fetch(
        `${RAWG_BASE}/games/${rawgId}/screenshots?key=${KEY}`
    );
    const shotsData = await shotsRes.json();

    return {
        background: gameData.background_image,
        screenshots: shotsData.results.map((s) => s.image),
    };
};
