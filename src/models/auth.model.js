const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    trim:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true 
  },
  password:{
    type:String,
    required:true,
    minlength:6
  },
  course:{
    type:String,
    
  },
  branch:{
    type:String,
    
  },
  currentSem:{
    type:Number,
    
  },
  role:{
    type:String,
    enum:['student' , 'admin'],
    default:'student'
  },
  isBlocked:{
    type:Boolean,
    default:false
  },
  profileCompleted:{
    type:Boolean,
    default:false
  },
  rollNumber:{
    type:Number,
    unique:true
  }

},
{
  timestamps:true

});
userSchema.pre('save' , async function() {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password , salt);
})
userSchema.statics.login = async function(email , password) {
  const user = await this.findOne({email});
  if(user) {
    const auth = await bcrypt.compare(password , user.password)
    if(auth) {
      return user
    } else {
      throw Error('Incorrect Password');
    }
  } else{
    throw Error('Incorrect Email')
  }
}
module.exports = new mongoose.model('User' , userSchema)