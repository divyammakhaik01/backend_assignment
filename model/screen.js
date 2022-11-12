// User Model
const mongoose = require("mongoose");

const ScreenSchema = new mongoose.Schema({

    MovieName : {
        type : String, 
        require : true
    } , 

    seatCount : {
        type : Number
    } , 

    occupiedSeats : [
        {
            type : Number
        }
    ] , 
    
    occupiedSeatsCount :{
        type: Number
    } ,

   
    
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  
  
  module.exports = mongoose.model("Screen", ScreenSchema);


  