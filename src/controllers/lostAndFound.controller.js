const lostAndFound = require("../models/lostAndFound.model");
module.exports.createPost = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      type,
      location,
      imageUrl,
      contactNumber,
    } = req.body;
    const report = await lostAndFound.create({
      title,
      description,
      category,
      type,
      location,
      imageUrl,
      contactNumber,
      postedBy: req.user._id,
    });
     return  res.status(200).json({
      message: "Reported Successfully!",
      report,
    });
  } catch (err) {
   return res.status(500).json({
      message: err.message,
    });
  }
};
module.exports.getAllPost = async (req , res)=>{
  try {
    const reports = await lostAndFound.find()
    .populate("postedBy" , "name email")
    .sort({createdAt:-1});

    return res.status(201).json({
      message:"Fetched all reports",
      reports
    })

  } catch(err) {
    return res.status(500).json({
      message:err.message
    })
  }
}
