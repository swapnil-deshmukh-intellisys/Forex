import mongoose from "mongoose";

const traderProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    displayName: {
      type: String,
      required: false,
      trim: true
    },
    bio: {
      type: String,
      maxlength: 500
    },
    avatar: {
      type: String
    },
    tradingStyle: {
      type: String,
      enum: ['Scalping', 'Day Trading', 'Swing Trading', 'Position Trading', 'Mixed'],
      required: false
    },
    preferredPairs: [{
      type: String
    }],
    totalFollowers: {
      type: Number,
      default: 0
    },
    totalFollowing: {
      type: Number,
      default: 0
    },
    totalCopies: {
      type: Number,
      default: 0
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    allowCopyTrading: {
      type: Boolean,
      default: false
    },
    performanceStats: {
      totalTrades: {
        type: Number,
        default: 0
      },
      winningTrades: {
        type: Number,
        default: 0
      },
      losingTrades: {
        type: Number,
        default: 0
      },
      winRate: {
        type: Number,
        default: 0
      },
      totalProfit: {
        type: Number,
        default: 0
      },
      averageProfit: {
        type: Number,
        default: 0
      },
      maxDrawdown: {
        type: Number,
        default: 0
      },
      sharpeRatio: {
        type: Number,
        default: 0
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    },
    verified: {
      type: Boolean,
      default: false
    },
    rank: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Index for leaderboard queries
traderProfileSchema.index({ 'performanceStats.totalProfit': -1 });
traderProfileSchema.index({ 'performanceStats.winRate': -1 });
traderProfileSchema.index({ rank: 1 });

const TraderProfile = mongoose.model("TraderProfile", traderProfileSchema);
export default TraderProfile;

