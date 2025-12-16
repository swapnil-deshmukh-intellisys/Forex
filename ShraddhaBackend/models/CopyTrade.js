import mongoose from "mongoose";

const copyTradeSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    trader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    traderProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TraderProfile',
      required: true
    },
    allocation: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    maxRiskPerTrade: {
      type: Number,
      required: false,
      default: 2
    },
    isActive: {
      type: Boolean,
      default: true
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    stoppedAt: {
      type: Date,
      required: false
    },
    totalCopiedTrades: {
      type: Number,
      default: 0
    },
    totalProfit: {
      type: Number,
      default: 0
    },
    settings: {
      copyOnlyProfitable: {
        type: Boolean,
        default: false
      },
      minTradeSize: {
        type: Number,
        default: 0
      },
      maxTradeSize: {
        type: Number,
        default: 10000
      },
      excludePairs: [{
        type: String
      }]
    }
  },
  { timestamps: true }
);

// Index for efficient queries
copyTradeSchema.index({ follower: 1, isActive: 1 });
copyTradeSchema.index({ trader: 1, isActive: 1 });
copyTradeSchema.index({ traderProfile: 1 });

const CopyTrade = mongoose.model("CopyTrade", copyTradeSchema);
export default CopyTrade;

