import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: String,
  answer: String,
  score: {
    type: Number,
    min: 0,
    max: 10
  },
  feedback: String
});

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  questions: [questionSchema],
  totalScore: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Interview', interviewSchema);