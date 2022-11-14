const User = require("../model/user");
const screen = require("../model/screen");
const movie_seat_relation = require("../model/movie_seat");

// const recommandSeat = async (req,res) => {
//   const allShows = await screen.find();
//       for (let i = 0; i < allShows.length; i++) {
//         let currentShowOccupiedSeatCount = allShows[i].occupiedSeatsCount;
//         let currentShowSeatCount = allShows[i].seatCount;
//         let currentShowName = allShows[i].MovieName;
//         if (currentShowOccupiedSeatCount < currentShowSeatCount) {
//           return res.json({
//             status: "true",
//             message: `This show is full you can book ticket for ${currentShowName}`,
//           });
//         }
//       }

//       return res.json({
//         status: "true",
//         message: "All shows are fully booked in the theater !!",
//       });
// }

const book_ticket = async (req, res) => {
  const { seatNumber, MovieName, userID } = req.body;

  if (!seatNumber || !MovieName || !userID) {
    return res.json({
      status: "false",
      error: "SeatNumber and MovieName or userID is missing !! ",
    });
  }

  try {
    const result = await screen.find({
      MovieName: MovieName,
    });


    let user = await User.findById(userID);

    if (result.length === 0) {
      return res.json({
        status: "false",
        error: `${MovieName} is not currently runnig in out theater !`,
      });
    }

    if (!user) {
      return res.json({
        status: "false",
        error: "User Not Found !!",
      });
    }

    let OccupiedSeatsCount = result[0].occupiedSeatsCount;
    let OccupiedSeats = result[0].occupiedSeats;
    let seatCount = result[0].seatCount;
    let screen_id = result[0]._id;
    
    //

    if (OccupiedSeatsCount === seatCount) {
      // console.log("enter");
      const allShows = await screen.find();
      for (let i = 0; i < allShows.length; i++) {
        let currentShowOccupiedSeatCount = allShows[i].occupiedSeatsCount;
        let currentShowSeatCount = allShows[i].seatCount;
        let currentShowName = allShows[i].MovieName;
        if (currentShowOccupiedSeatCount < currentShowSeatCount) {
          return res.json({
            status: "true",
            message: `This show is full you can book ticket for ${currentShowName}`,
          });
        }
      }

      return res.json({
        status: "true",
        message: "All shows are fully booked in the theater !!",
      });
    }


    // update screen DB

    // find if seatNumber is already booked or not


    // for(let  i = 1 ; i <= OccupiedSeats ; i++){
    //   if(OccupiedSeats[i] === seatNumber){
    //   console.log("enter--");
    //   // const allShows = await screen.find();
    //   for (let i = 1; i <= seatNumber; i++) {
    //     let currentShowOccupiedSeatCount = allShows[i].occupiedSeatsCount;
    //     let currentShowSeatCount = allShows[i].seatCount;
    //     let currentShowName = allShows[i].MovieName;
    //     if (currentShowOccupiedSeatCount < currentShowSeatCount) {

    //       return res.json({
    //         status: "true",
    //         message: `This seat is full you can book ticket for ${currentShowName}`,
    //       });

    //     }
    //   }

    //   return res.json({
    //     status: "true",
    //     message: "All shows are fully booked in the theater !!",
    //   });
    //   }
    // }

    OccupiedSeats.push(seatNumber);


    let updateScreen = await screen.findByIdAndUpdate(
      screen_id , 
      {
        occupiedSeatsCount: OccupiedSeatsCount + 1,
        occupiedSeats: OccupiedSeats
      },
      { new: true }
    );
    // update user DB-------------------------------------------------------------------------------

    let seat = user.seatBook;
    let user_id = user._id;

    // 
    console.log("p1");
    // 
    const find_movie_seat = await movie_seat_relation.find({
      MovieName : MovieName
      }); 
      console.log("p2");

      let arr = []

      console.log(">>>>   " , find_movie_seat);
    
    if(find_movie_seat.length === 0 ){
      arr.push(seatNumber);
      const movie_seat_create  = await movie_seat_relation.create({
        MovieName : MovieName , 
        SeatNumber : arr
    })
    seat.push(movie_seat_create._id);
    }else{
      arr = find_movie_seat[0].SeatNumber;
      arr.push(seatNumber);
      const update_movie_seat = await movie_seat_relation.findByIdAndUpdate(find_movie_seat[0]._id , {
        SeatNumber : arr
      }) 
    seat.push(find_movie_seat[0]._id);
    }
    
    // 
console.log(seat);
    let updatedUser = await User.updateMany({
        seatBook: seat
    })

    return res.json({
      status: "true",
      message: "Booked",
      data: {
        updateScreen,
        updatedUser,
      },
    });
  } catch (error) {
    return res.status(401).json({
      status: "false",
      error: error,
    });
  }
};

const cancel_ticket = async (req, res) => {
  const { seatNumber, MovieName, userID } = req.body;

  if (!seatNumber || !MovieName) {
    return res.status(400).json({
      status: "false",
      error: "SeatNumber and MovieName is missing !! ",
    });
  }

  try {
    const result = await screen.find({
      MovieName: MovieName,
    });
    console.log("p1");

    let user = await User.findById(userID);

    if (result.length === 0) {
      return res.json({
        status: "false",
        error: `${MovieName} is not currently runnig in out theater !`,
      });
    }

    if (!user) {
      return res.json({
        status: "false",
        error: "User Not Found !!",
      });
    }
console.log("p2");
    let occupiedSeatsCount = result[0].occupiedSeatsCount;
    let occupiedSeats = result[0].occupiedSeats;

    let screen_id = result[0]._id;
    console.log(">           " , occupiedSeats);
    console.log(seatNumber);
    console.log(occupiedSeats);
    
    let index;

    for(let i = 0 ; i < occupiedSeats.length ; i++){
      if(occupiedSeats[i] === seatNumber){
        index = i ;
        break;
      }
    }
    
    occupiedSeats.splice(index, 1);

    const _find = await movie_seat_relation.find({
      MovieName : MovieName , 
      SeatNumber : seatNumber
    });


    const up = await movie_seat_relation.findByIdAndDelete(_find[0]._id);
    console.log(up);

    // update screen DB

    let updateScreen = await screen.findByIdAndUpdate(
      {
        // filter
        screen_id,
      },
      {
        // update
        occupiedSeatsCount: occupiedSeatsCount - 1,
        occupiedSeats: occupiedSeats,
      },
      { new: true }
    );

    // update user DB

    let seat = user.seatBook;
    let user_id = user._id;

    console.log("here1");

    let userindex = seat.findIndex({ MovieName, seatNumber });
    seat.splice(userindex, 1);
    console.log("here2");

    let updatedUser = await User.findByIdAndUpdated(
      {
        user_id,
      },
      {
        seatBook: seat,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      status: "true",
      message: "Booked",
      data: {
        updateScreen,
        updatedUser,
      },
    });
  } catch (error) {
    return res.status(401).json({
      status: "false",
      error: error,
    });
  }
};

const edit_Screen = async(req , res) =>{

    const {MovieName , seatCount } = req.body;

    if(MovieName === '' || seatCount === '' ){
        return res.json({
            "status" :"false" ,
            "message" : "MovieName or seatCount is missing !!"
        })
    }
    
    try {

        const movie_screen = await screen.create({
            MovieName ,
            seatCount
        })

        return res.status(200).json({
            "status" : "true" , 
            "message" : movie_screen
        })
        
        
    } catch (error) {
        return res.status(401).json({
            "status" : "false" , 
            "message" : error
        })
    }
}


module.exports = {
  book_ticket,
  cancel_ticket,
  edit_Screen
};
