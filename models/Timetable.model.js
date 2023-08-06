const { Schema, model } = require('mongoose')

const TimetableSchema = new Schema(
  {
    subject: {
      type: String,
      enum: [
        'math',
        'french',
        'english',
        'history',
        'music',
        'technology',
        'sport',
        'svt',
        'geography',
        'chemistry',
        'lunch',
      ],
      required: true,
    },
    isHoliday: {
      type: Boolean,
      default: false,
    },
    teacher: {
      type: String,
    },
    classroom: {
      type: String,
    },
    dateTimetable: {
      type: String,
      required: true,
    },
    timeTimetable: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const Timetable = model('Timetable', TimetableSchema)

module.exports = Timetable
