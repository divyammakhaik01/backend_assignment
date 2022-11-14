const User = require('../model/user')



module.exports = async(req , res , next) => {

    try {
        
        const {userID} = req.body ;

        if(!userID){
            return res.status(400).json({
                "status" : "false" ,
                "message" : "userID not found"
            })
        }

        const user = await User.findById(userID);

        if(!user.isAdmin){
            return res.status(403).json({
                "status" : "false" ,
                "message" : "Not authorized !!!" 
            })
        }
        console.log("here");
        next();
    } catch (error) {
        return res.status(401).json({
            "status" : "false" , 
            "message" : error
        })
    }

}