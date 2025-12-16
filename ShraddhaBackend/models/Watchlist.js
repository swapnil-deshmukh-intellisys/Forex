import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    instruments: [{
      symbol: {
        type: String,
        required: true,
        trim: true
      },
      name: {
        type: String,
        required: false
      },
      category: {
        type: String,
        enum: ['Forex', 'Crypto', 'Stocks', 'Commodities', 'Indices'],
        default: 'Forex'
      },
      addedAt: {
        type: Date,
        default: Date.now
      },
      priceAlerts: [{
        targetPrice: {
          type: Number,
          required: true
        },
        condition: {
          type: String,
          enum: ['above', 'below', 'equals'],
          required: true
        },
        isActive: {
          type: Boolean,
          default: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        },
        triggeredAt: {
          type: Date,
          required: false
        }
      }],
      notes: {
        type: String,
        maxlength: 500
      }
    }],
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Index for efficient queries
watchlistSchema.index({ user: 1 });
watchlistSchema.index({ 'instruments.symbol': 1 });

const Watchlist = mongoose.model("Watchlist", watchlistSchema);
export default Watchlist;

