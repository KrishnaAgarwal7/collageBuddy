const User = require('../models/auth.model');
module.exports.getAllUsers = async (req , res)=>{
  try{
    const users = await User.find().select('-password').sort({createdAt:-1})
     return res.status(200).json({
            users
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }
  }
module.exports.blockUser = async (req , res)=>{
  try {
  const user = await User.findByIdAndUpdate(req.params.id ,
    {
      isBlocked:true
    } , {
      new:true
    }
  ).select('-password');
   if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        return res.status(200).json({
            message: "User blocked successfully",
            user
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });
      }

}
module.exports.unBlockUser = async (req , res)=>{
  try {
  const user = await User.findByIdAndUpdate(req.params.id ,
    {
      isBlocked:false
    } , {
      new:true
    }
  ).select('-password');
   if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        return res.status(200).json({
            message: "User unblocked successfully",
            user
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });
      }

}