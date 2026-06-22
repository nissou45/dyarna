import mongoose, { Document, Schema } from 'mongoose';

export interface ILeaderboardEntry extends Document {
  userId: mongoose.Types.ObjectId;
  displayName: string;
  bestScore: number;
  gamesPlayed: number;
}

const leaderboardEntrySchema = new Schema<ILeaderboardEntry>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    displayName: { type: String, required: true },
    bestScore: { type: Number, required: true, default: 0 },
    gamesPlayed: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

leaderboardEntrySchema.index({ bestScore: -1 });

export const LeaderboardEntry = mongoose.model<ILeaderboardEntry>(
  'LeaderboardEntry',
  leaderboardEntrySchema,
);
