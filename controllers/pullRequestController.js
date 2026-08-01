const PullRequest = require("../models/pullRequestModel");

async function createPullRequest(req, res) {
  const { repoId } = req.params;
  const {
    title,
    description,
    sourceBranch,
    targetBranch,
  } = req.body;

  try {
    const pullRequest = new PullRequest({
      title,
      description,
      repository: repoId,
      sourceBranch,
      targetBranch,
    });

    await pullRequest.save();

    res.status(201).json(pullRequest);
  } catch (err) {
    console.error("Pull request creation error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
}

async function getAllPullRequests(req, res) {
  try {
    const pullRequests = await PullRequest.find({})
      .populate("repository", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(pullRequests);
  } catch (err) {
    console.error("Pull request fetching error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
}

async function getRepositoryPullRequests(req, res) {
  const { repoId } = req.params;

  try {
    const pullRequests = await PullRequest.find({
      repository: repoId,
    }).sort({ createdAt: -1 });

    res.status(200).json(pullRequests);
  } catch (err) {
    console.error("Pull request fetching error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
}

async function updatePullRequest(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const pullRequest = await PullRequest.findByIdAndUpdate(
      id,
      {
        title,
        description,
        status,
      },
      { new: true }
    );

    if (!pullRequest) {
      return res.status(404).json({
        message: "Pull request not found",
      });
    }

    res.json(pullRequest);
  } catch (err) {
    console.error("Pull request update error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
}

async function deletePullRequest(req, res) {
  const { id } = req.params;

  try {
    const pullRequest = await PullRequest.findByIdAndDelete(id);

    if (!pullRequest) {
      return res.status(404).json({
        message: "Pull request not found",
      });
    }

    res.json({
      message: "Pull request deleted",
    });
  } catch (err) {
    console.error("Pull request deletion error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = {
  createPullRequest,
  getAllPullRequests,
  getRepositoryPullRequests,
  updatePullRequest,
  deletePullRequest,
};