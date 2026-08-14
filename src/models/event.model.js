const mongoose = require('mongoose')
const eventSchema = new mongoose.Schema({
   title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    organizer: {
        type: String
    },

    eventDate: {
        type: Date,
        required: true
    },

    registrationDeadline: {
        type: Date
    },

    location: {
        type: String
    },

    registrationUrl: {
        type: String
    },

    imageUrl: {
        type: String
    },

    type: {
        type: String,
        enum: [
            "hackathon",
            "workshop",
            "competition",
            "seminar",
            "other"
        ],
        default: "other"
    }

}, {
    timestamps: true
}
)

module.exports = mongoose.model('Event', eventSchema)