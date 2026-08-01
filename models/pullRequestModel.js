const mongoose = require("mongoose");

const pullRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["open", "closed", "merged"],
      default: "open",
    },

    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },

    sourceBranch: {
      type: String,
      default: "feature",
    },

    targetBranch: {
      type: String,
      default: "main",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PullRequest", pullRequestSchema);