const User = require('../models/auth.model');
module.exports.user_profile = async (req,res) => {
   try{
    const {currentSem , branch , rollNumber , course} = req.body;
    const user = await User.findByIdAndUpdate(req.user._id
      ,{
        currentSem,
        branch,
        rollNumber,
        course,
        profileCompleted:true
      } , {new:true}
    );
    res.status(200).json({user , message:"Profile updated successfully"});
   }catch(err) {
    res.status(500).json({
      message:err.message
    })
   }
}