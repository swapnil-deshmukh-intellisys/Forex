import mongoose from "mongoose";

const tradingJournalSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: false
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    entryDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    currencyPair: {
      type: String,
      required: false,
      trim: true
    },
    tradeType: {
      type: String,
      enum: ['Buy', 'Sell', 'Long', 'Short', 'Analysis', 'Note'],
      default: 'Note'
    },
    entryPrice: {
      type: Number,
      required: false
    },
    exitPrice: {
      type: Number,
      required: false
    },
    stopLoss: {
      type: Number,
      required: false
    },
    takeProfit: {
      type: Number,
      required: false
    },
    lotSize: {
      type: Number,
      required: false
    },
    profit: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      required: false,
      maxlength: 5000
    },
    tags: [{
      type: String,
      trim: true
    }],
    emotions: {
      type: String,
      enum: ['Confident', 'Nervous', 'Excited', 'Frustrated', 'Calm', 'Greedy', 'Fearful'],
      required: false
    },
    lessons: {
      type: String,
      maxlength: 1000
    },
    images: [{
      type: String
    }],
    isPublic: {
      type: Boolean,
      default: false
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
tradingJournalSchema.index({ user: 1, entryDate: -1 });
tradingJournalSchema.index({ user: 1, currencyPair: 1 });
tradingJournalSchema.index({ user: 1, tags: 1 });

const TradingJournal = mongoose.model("TradingJournal", tradingJournalSchema);
export default TradingJournal;

