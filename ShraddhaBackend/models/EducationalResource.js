import mongoose from "mongoose";

const educationalResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000
    },
    content: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['Article', 'Video', 'Tutorial', 'Quiz', 'Course', 'Webinar'],
      required: true
    },
    category: {
      type: String,
      enum: ['Basics', 'Technical Analysis', 'Fundamental Analysis', 'Risk Management', 'Psychology', 'Strategies', 'Platform Guide'],
      required: true
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true
    },
    duration: {
      type: Number, // in minutes
      required: false
    },
    videoUrl: {
      type: String,
      required: false
    },
    thumbnail: {
      type: String,
      required: false
    },
    author: {
      type: String,
      required: false
    },
    tags: [{
      type: String,
      trim: true
    }],
    isPublished: {
      type: Boolean,
      default: false
    },
    publishedAt: {
      type: Date,
      required: false
    },
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    },
    order: {
      type: Number,
      default: 0
    },
    prerequisites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EducationalResource'
    }],
    relatedResources: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EducationalResource'
    }]
  },
  { timestamps: true }
);

// Index for efficient queries
educationalResourceSchema.index({ type: 1, category: 1, level: 1 });
educationalResourceSchema.index({ isPublished: 1, order: 1 });
educationalResourceSchema.index({ tags: 1 });

const EducationalResource = mongoose.model("EducationalResource", educationalResourceSchema);
export default EducationalResource;

