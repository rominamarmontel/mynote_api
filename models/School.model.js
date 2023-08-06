const { Schema, model } = require('mongoose')

const SchoolSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
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
      ],
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 20,
    },
    examDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
)

const School = model('School', SchoolSchema)

module.exports = School
