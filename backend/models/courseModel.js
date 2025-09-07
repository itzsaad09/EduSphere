import mongoose from "mongoose";

function convertIsoToSeconds(isoDuration) {
  if (!isoDuration) return 0;
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = isoDuration.match(regex);
  if (!matches) return 0;

  const hours = parseInt(matches[1] || "0", 10);
  const minutes = parseInt(matches[2] || "0", 10);
  const seconds = parseInt(matches[3] || "0", 10);

  return hours * 3600 + minutes * 60 + seconds;
}

const videoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 0,
  },
});

const courseSchema = mongoose.Schema({
  thumbnail: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  numReviews: {
    type: Number,
    required: true,
  },
  enrollments: {
    type: Number,
    required: true,
  },
  videos: [videoSchema],
  playlistUrl: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

courseSchema.pre("save", function (next) {
  if (this.isModified("videos") && this.videos && this.videos.length > 0) {
    this.totalDuration = this.videos.reduce(
      (acc, video) => acc + video.duration,
      0
    );
  }
  next();
});

const courseModel = mongoose.model("Course", courseSchema);
export default courseModel;
