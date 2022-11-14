const express = require("express");
const router = express.Router();
const theaterController = require('../controller/theaterController');
const checkAdmin = require('../middleware/validateAdmin') 


router.route("/book_ticket").post(theaterController.book_ticket);
router.route("/cancel_ticket").post(theaterController.cancel_ticket);


// admin can update movies screen status (ie number of seats | number of shows) etc 

router.post("/edit_Screens",checkAdmin , theaterController.edit_Screen);


module.exports = router;