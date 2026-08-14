const User = require('../models/auth.model')
module.exports.adminOnly = async (req , res, next)=> {
  try {
    const user = await User.findById(req.user._id)
    if(!user) {
      return res.status(404).json({
        message:"User not found"
      })
    }
    if(user.isBlocked) {
      return res.status(403).json({
        message:"your account has been blocked"
      })
    }
    if(user.role !== 'admin') {
      return res.status(403).json({
        message:"Admin access requires"
      })
    }
    next();
  } catch(err) {
    console.log(err)
    return res.status(500).json({
      message: err.message
    })
  }
}