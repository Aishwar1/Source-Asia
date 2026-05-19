const { rateLimitStore } = require("../storage/memoryStore");

const WINDOW_SIZE = 60 * 1000;
const MAX_REQUESTS = 5;

const handleRequest = (req, res) => {

    const { user_id, payload } = req.body;

    if (!user_id || user_id.trim() === "" || payload === undefined) {
        return res.status(400).json({
            message: "Invalid input"
        });
    }

    const now = Date.now();

    if (!rateLimitStore.has(user_id)) {
        rateLimitStore.set(user_id, {
            timestamps: [],
            rejected: 0
        });
    }

    const userData = rateLimitStore.get(user_id);

    userData.timestamps = userData.timestamps.filter(
        (time) => now - time < WINDOW_SIZE
    );

    if (userData.timestamps.length >= MAX_REQUESTS) {

        userData.rejected += 1;

        return res.status(429).json({
            message: "Rate limit exceeded"
        });
    }

    userData.timestamps.push(now);

    return res.status(201).json({
        message: "Request accepted"
    });
};

const getStats = (req, res) => {

    const stats = {};

    for (const [userId, data] of rateLimitStore.entries()) {

        stats[userId] = {
            accepted_requests: data.timestamps.length,
            rejected_requests: data.rejected
        };
    }

    return res.status(200).json(stats);
};

module.exports = {
    handleRequest,
    getStats
};