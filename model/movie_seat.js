// User Model
const mongoose = require("mongoose");


const movie_seat_relation = new mongoose.Schema({
    MovieName :{
        type : String
    } , 
    SeatNumber :[{
        type : Number
    }]
  });
  
 
  module.exports = mongoose.model("movie_seat", movie_seat_relation);

