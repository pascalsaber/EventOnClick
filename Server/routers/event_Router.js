const express = require('express');
const router = express.Router();
const eventController = require("../controllers/event_Controller");

router.post("/add", eventController.add);
router.post("/updateEventByID", eventController.updateEventByID)
router.post("/updateMealsOrDecoration", eventController.updateMealsOrDecoration);
router.post("/updatePayment", eventController.updatePayment);
router.get("/deleteEvent", eventController.deleteEvent);
router.get("/returnEnumListByType", eventController.returnEnumListByType);
router.get("/allEvents", eventController.allEvents);
router.get("/findOneEvent", eventController.findOneEvent);
module.exports = router;