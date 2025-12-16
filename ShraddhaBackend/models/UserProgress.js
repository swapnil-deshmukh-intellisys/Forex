import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EducationalResource',
      required: true
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started'
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    startedAt: {
      type: Date,
      required: false
    },
    completedAt: {
      type: Date,
      required: false
    },
    timeSpent: {
      type: Number, // in minutes
      default: 0
    },
    quizResults: [{
      questionId: {
        type: String,
        required: true
      },
      answer: {
        type: String,
        required: true
      },
      isCorrect: {
        type: Boolean,
        required: true
      },
      answeredAt: {
        type: Date,
        default: Date.now
      }
    }],
    notes: {
      type: String,
      maxlength: 2000
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: false
    }
  },
  { timestamps: true }
);

// Index for efficient queries
userProgressSchema.index({ user: 1, resource: 1 }, { unique: true });
userProgressSchema.index({ user: 1, status: 1 });

const UserProgress = mongoose.model("UserProgress", userProgressSchema);
export default UserProgress;

