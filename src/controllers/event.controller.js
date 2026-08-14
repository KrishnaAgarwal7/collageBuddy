const Event = require('../models/event.model');
module.exports.createEvent = async (req , res) =>{
  try {

        const {
            title,
            description,
            organizer,
            eventDate,
            registrationDeadline,
            location,
            registrationUrl,
            imageUrl,
            type
        } = req.body;

        const event = await Event.create({
           title,
            description,
            organizer,
            eventDate,
            registrationDeadline,
            location,
            registrationUrl,
            imageUrl,
            type
        })
        return res.status(201).json({
          message:"Event created successfully"
        })
      }catch(err) {
        res.status(500).json({
          message:err.message
        })
      }
}
module.exports.getEvents = async (req , res)=>{
  try{
    const events = await Event.find().sort({eventDate:1});
    res.status(200).json({
      message:"Fetched events successfully",
      events
    })
  }catch(err) {
        res.status(500).json({
          message:err.message
        })
      }
}
module.exports.updateEvent = async (req , res)=>{
  try {
    const {
            title,
            description,
            organizer,
            eventDate,
            registrationDeadline,
            location,
            registrationUrl,
            imageUrl,
            type
        } = req.body;

        const event = await Event.findByIdAndUpdate(req.params.id ,
          {
             title,
            description,
            organizer,
            eventDate,
            registrationDeadline,
            location,
            registrationUrl,
            imageUrl,
            type
          },
           {
            new:true,
            runValidators:true
           }
        )

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }


        return res.status(200).json({
            message: "Event updated successfully",
            event
        });


    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }
  
}
module.exports.deleteEvent = async (req, res) => {
    try {

        const event = await Event.findByIdAndDelete(
            req.params.id
        );


        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }


        return res.status(200).json({
            message: "Event deleted successfully"
        });


    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }
};