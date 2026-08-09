const mongoose = require('mongoose');
const notesSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true,
  },
  description:{
    type:String,
  },
  courseID:{
    type:String,
    required:true
  },
  semester:{
    type:Number,
    required:true
  },
  fileUrl:{
    type:String,
    required:true
  },
  uploadedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  }
},
{
  timestamps:true
})

module.exports = mongoose.model('Notes' , notesSchema);