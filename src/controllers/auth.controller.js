const jwt = require("jsonwebtoken");
const User = require("../models/auth.model");
const maxTime = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxTime,
  });
};
module.exports.signup_post = async (req, res) => {
  const { name, email, password } = req.body;
  if(!email.endsWith("iiitg.ac.in")) {
    return res.status(400).json({"message":"Please use your college email"});
  }
    const isExist = await User.findOne({email})
  if (isExist) {
    return res.status(400).json({ message: "User already exists" });
  }
  try {
    const user = await User.create({ name, email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxTime * 1000 });
    res.status(201).json({user: user._id, message: "User created successfully"});
  } catch (err) {
    console.log(err);
  }
};
module.exports.login_post = async (req , res)=> {
  const { email, password } = req.body;
  const user = await User.login(email, password);
  if(!user) {
    return res.status(400).json({message: "User not found"});
  }
  try{
    const token =  createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxTime * 1000 });
    res.status(200).json({
      user: user._id,
      profileCompleted: user.profileCompleted,
      message: "User logged in successfully"
    });
  }catch(err) {
    console.log(err);
  }

}

