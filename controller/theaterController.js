const User = require("../model/user");
const screen = require("../model/screen");


const book_ticket = async(req , res) => {

    const {seatNumber , MovieName , userID} = req.body ;

    if(!seatNumber || !MovieName){
        return res.json({
            "status":"false",
            "error" : "SeatNumber and MovieName is missing !! "
        })
    }

    try {

        const result = await screen.find({
            "MovieName" : MovieName
        })

        let user = await User.findById(userID);


        if(result.length === 0 ){
            return res.json({
                "status" : "false" ,
                "error" : `${MovieName} is not currently runnig in out theater !`
            })
        }

        if(!user){
            return res.json({
                "status" : "false" ,
                "error" : "User Not Found !!"
            })            
        }

        let occupiedSeatsCount = result[0].occupiedSeatsCount ;
        let occupiedSeats = result[0].occupiedSeats ;
        let seatCount = result[0].seatCount ;
        let id = result[0]._id ;

        // 
        
        if(occupiedSeatsCount === seatCount) {

            const allShows = await screen.find();

            for(let i = 0 ; i < allShows.length ; i++){
                let currentShowOccupiedSeatCount = allShows[i].occupiedSeatsCount ;
                let currentShowSeatCount = allShows[i].seatCount ;
                let currentShowName = allShows[i].MovieName ; 
                if(currentShowOccupiedSeatCount  < currentShowSeatCount ){
                    return res.json({
                        "status" : "true" ,
                        "message" : `${MovieName} show is full you can book ticket for ${currentShowName}`
                    })
                }   
            }

            return res.json({
                "status" :"true" , 
                "message" : "All shows are fully booked in the theater !!"
            })
            
        }

        occupiedSeats.push(seatNumber);

        // update screen DB 

        let updateScreen = await screen.findByIdAndUpdate({
            // filter
            id
        } , {
            // update
            occupiedSeatsCount : occupiedSeatsCount-1 , 
            occupiedSeats : occupiedSeats 

        } , {new:true}) ;

        // update user DB

        let seat = user.seatBook ;

        seat.push({MovieName , seatNumber }) ; 

        let updatedUser  = await user.findByIdAndUpdated({
            id
        } , {
            seatBook : seat
        } ,{
            new:true
        })

        return res.json({
            "status" :"true" ,
            "message" : "Booked", 
            "data" : {
                updateScreen , 
                updatedUser
            }
        })
        
        
    } catch (error) {
        return res.json({
            "status" :"false",
            "error" : error
        })
    }
    

}







module.exports = {

    book_ticket

};



