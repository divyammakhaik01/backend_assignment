const express = require("express");
const router = express.Router();
const theaterController = require('../controller/theaterController');


router.route("/book_ticket").post(theaterController.book_ticket);
router.route("/cancel_ticket").post(theaterController.cancel_ticket);


module.exports = router;