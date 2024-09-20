const express = require('express');
const router = express.Router();
const eventController = require("../controllers/event_Controller");

router.post("/add", eventController.add);
router.post("/updateMeals", eventController.updateMeals);
router.get("/returnEnumListByType", eventController.returnEnumListByType);
router.get("/allEvents", eventController.allEvents);
router.get("/findOneEvent", eventController.findOneEvent);

module.exports = router;