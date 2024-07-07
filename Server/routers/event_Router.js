const express = require('express');
const router = express.Router();
const eventController = require("../controllers/event_Controller");

router.post("/add", eventController.add);
router.get("/enumRequest", eventController.enumRequest);
router.get("/allEvents", eventController.allEvents);
module.exports = router;