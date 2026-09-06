import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },

    meeting_id: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting };
