const express = require("express");

const router = express.Router();

const {
    handleRequest,
    getStats
} = require("../controllers/requestController");

router.post("/request", handleRequest);

router.get("/stats", getStats);

module.exports = router;