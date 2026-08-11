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
module.exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        return res.status(200).json({
            user,
            profileCompleted : user.profileCompleted,
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};